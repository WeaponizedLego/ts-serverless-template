import * as jwt from 'jsonwebtoken'
import { formatResponse } from '@src/resources/response'
import * as knex from '@src/resources/knex-manager'

/**
 * @title Authorization
 * @description returns a object with either status true and the user object or false with a response
 * @param req
 * @param userLevel
 */
export const authorize = async (
  req: Record<string, any>,
  userLevel?: number
) => {
  const db = knex.connect()
  try {
    req.headers.Authorization = getAuthorization(req)

    const headers: { oStatus: boolean } | { response: any; oStatus: boolean } =
      validateHeader(req)

    if (!headers.oStatus) {
      return headers
    }

    const token: string = req.headers.Authorization.substring(6)

    const tokenDecoded: any = jwt.decode(token, { complete: true })

    // Fetch a users sessions, and all data on that user from Users table and return it to the request
    const userRecords: Record<string, any> = await db
      .select('')
      .from('users_sessions as us')
      .where('us.id', '=', tokenDecoded.payload.sessionId)
      .leftJoin('users as u', 'u.id', '=', 'us.userId')
      .where('u.id', '=', tokenDecoded.payload.userId)
    const user: Record<string, string> = userRecords[0]
    const secret: Buffer = Buffer.from(user.authToken, 'hex')
    await jwt.verify(token, secret)

    console.log('user information: ', {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      level: user.UserLevel
    })
    if (userLevel !== undefined && parseInt(user.UserLevel, 10) < userLevel) {
      console.log(user.id)
      await db.destroy()
      return {
        oStatus: false,
        response: formatResponse({
          statusCode: 400,
          message: 'User is not allowed to view this resource',
          error: 'User authorization level is too low',
          cors: true
        })
      }
    }

    await db.destroy()
    return {
      oStatus: true,
      data: user,
      response: formatResponse({
        statusCode: 200,
        message: 'User object successfully returned',
        data: user,
        cors: true
      })
    }
  } catch (e) {
    await db.destroy()
    console.log(e)
    return {
      oStatus: false,
      response: formatResponse({
        statusCode: 401,
        message:
          'malformed request. This can be caused by information being missing, incorrect or the token being invalid. If the signature is malformed, the token is invalid',
        cors: true
      })
    }
  }
}

/**
 * @title Validate Header
 * @description returns an object with either status true and the user object or false with a response
 * @param event
 */
export const getAuthorization = (event: Record<string, any>) => {
  let contentType = event.headers.Authorization
  if (!contentType) {
    return event.headers.authorization
  }
  return contentType
}

/**
 * @title validateHeader
 * @description validates the header and returns a object with either status true and the user object or false with a response
 * @param req
 * @returns {object<{status, response}>}
 */
const validateHeader = (
  req: Record<string, any>
): { oStatus: boolean } | { response: any; oStatus: boolean } => {
  // console.log(req.headers)
  if (
    (req?.headers?.Authorization &&
      req.headers.Authorization.match(/Local /)) ||
    (req?.headers?.authorization && req.headers.authorization.match(/Local /))
  ) {
    return {
      oStatus: true
    }
  }
  console.log('no headers')
  return {
    oStatus: false,
    response: formatResponse({
      statusCode: 400,
      message: 'No Authorization header found.',
      cors: true
    })
  }
}

/**
 *
 * @param type {string} can be either 'email' or 'id'
 * @param value {string|number} the value to search for either in the email or id column
 */
export const getUserFrom = async (type: string, value: string | number) => {
  let user: Record<string, any>

  if (!type || !value) {
    console.log('no type or value')
    console.log({ type, value })
    return false
  }

  const db = knex.connect()
  try {
    switch (type) {
      default:
      case 'email':
        user = await db('users')
          .select()
          .leftJoin('users_networks as un', function () {
            this.on('un.userId', '=', 'users.id')
          })
          .where('UserEmail', '=', value)
        break
      case 'id':
        user = await db('users')
          .select()
          .leftJoin('users_networks as un', function () {
            this.on('un.userId', '=', 'users.id')
          })
          .where('users.id', '=', value)
        break
      case 'userName':
        user = await db('users').select().where('UserName', '=', value)
    }

    await db.destroy()

    return user[0]
  } catch (e) {
    console.log('fetch user by email | id error:', e)
    await db.destroy()

    return false
  }
}
