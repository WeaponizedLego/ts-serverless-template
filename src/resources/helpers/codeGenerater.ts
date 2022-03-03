import moment from 'moment'

/**
 * @title tokenGenerator
 * @description generates 6 character code, used for generating reset tokens usual life span is 24 hours. Tokens are generated from a
 * @example 628504
 * @param seed - seed for generating code *optional*
 * @returns {string}
 */
export const generateResetCode = (seed?: string): string => {
  if (!seed) {
    console.log('seed is not provided, using default seed')
  }
  return moment.utc().format('X').toString().slice(-6)
}
