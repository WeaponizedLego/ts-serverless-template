interface FormatResponseParams {
  statusCode: number
  message: string
  data?: any
  error?: any
  cors?: boolean
}

interface FormatResponse {
  statusCode: number
  body: string
  headers?: Record<string, any>
}

/**
 * @title FormatResponse
 * @description Formats a response object into a string and returns it. This is used to send the response to the client.
 * @param statusCode
 * @param message
 * @param data
 * @param error
 * @param cors
 */
export const formatResponse = ({
  statusCode,
  message,
  data,
  error,
  cors
}: FormatResponseParams): Record<string, any> => {
  const body: { message?: string; data?: any; error?: any } = {}

  body.message = message

  if (data) {
    body.data = data
  } else {
    body.data = ''
  }

  if (error) {
    body.error = error
  } else {
    body.error = ''
  }

  const res: FormatResponse = {
    statusCode,
    body: JSON.stringify(body)
  }

  if (cors === true) {
    res.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }

  // console.log('FORMAT Response')
  // console.log(res)

  return res
}
