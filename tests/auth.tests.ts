import { describe, it } from 'mocha'
import { expect } from 'chai'
import { getAuthorization } from '../src/resources/auth'

describe('get Authorization Header', () => {
  const event = {
    headers: {
      Authorization: 'Bearer ey'
    }
  }
  it('should return a string', () => {
    expect(getAuthorization(event)).to.be.a('string')
  })
  it('should return the Authorization header', () => {
    expect(getAuthorization(event)).to.haveOwnProperty('Authorization')
  })

  it('should contain the Bearer prefix', () => {
    expect(getAuthorization(event)).to.contain('Bearer')
  })
})

//
// describe('get authorization Header', () => {
//
// })
