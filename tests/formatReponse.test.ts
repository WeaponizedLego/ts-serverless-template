import { describe, it } from 'mocha'
import { expect } from 'chai'
import { formatResponse } from '../src/resources/response'

describe('formatResponse', () => {
  it('should return a formatted response', () => {
    const response = {
      statusCode: 200,
      message: 'Everything is ok'
    }
    const formattedResponse = formatResponse(response)
    console.log(formattedResponse)
    expect(formattedResponse).to.deep.equal({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Everything is ok',
        data: '',
        error: ''
      })
    })
  })
})
