// validator helper to validate the input across the application

// import joi from 'joi'
import joi from 'joi'
import { formatResponse } from '@src/resources/response'

/**
 * @description validates the input based on schema provided
 * @param opts {object} - options object containing schema, input and error message
 */
export const validator = (opts: {
  schema: joi.AnySchema
  data: Record<string, any>
  errorMessage: string
}) => {
  // validate the input
  const { error, value } = opts.schema.validate(opts.data)

  if (error) {
    console.log('error', error)
    return {
      oStatus: false,
      response: formatResponse({
        statusCode: 400,
        message: opts.errorMessage,
        error
      })
    }
  }
  // if there is no error, return the value
  // return value
  value.oStatus = true
  return value
}
