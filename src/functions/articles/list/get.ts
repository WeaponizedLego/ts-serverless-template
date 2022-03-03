import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import joi from 'joi'
import * as knex from '@src/resources/knex-manager'
import { formatResponse } from '@src/resources/response'
import { validator } from '@src/resources/helpers/validator'
import { authorize } from '@src/resources/auth'

export const handler: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent
) => {
  // initialize knex outside of try/catch to allow for graceful shutdown
  const db = knex.connect()

  const user: Record<string, any> = await authorize(_event)

  if (!user.oStatus) {
    return user.response
  }

  try {
    const params: Record<string, any> = validator({
      schema: joi.object().keys({
        latitude: joi.number().required(),
        longitude: joi.number().required(),
        radius: joi.number().optional().default(25).min(1).max(300),
        mode: joi
          .string()
          .optional()
          .valid('clean', 'full', 'normal')
          .default('normal')
      }),
      data: <Record<string, any>>_event.queryStringParameters,
      errorMessage:
        'Invalid query string parameters: Expected latitude, longitude, radius(optional<1-200>)'
    })

    if (!params.oStatus) {
      return params.response
    }

    // close connection before returning response to prevent connection leakage
    await db.destroy()
    return formatResponse({
      statusCode: 200,
      message: 'Successfully retrieved pin(s) in area',
      data: {}
    })
  } catch (e) {
    // close connection before returning response to prevent connection leakage
    await db.destroy()
    console.log(e)
    return formatResponse({
      statusCode: 500,
      message: 'Something went wrong'
    })
  }
}
