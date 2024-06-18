import jwt from 'jsonwebtoken'
import { Errors, Redis, logger } from '.'

import { config } from '../configs'
import { UserAuth } from '../configs/types'
import { MESSAGES } from '../middlewares/i18n'

const { algorithm, allow_renew: allowRenew, cache_prefix: cachePrefix, key, expiration, renew_threshold: renewThreshold } = config.jwt

interface Data {
  id: string
  role: string
  email?: string
  mobile?: string
}

enum CACHE_KEY_TYPES {
  VALID = 'valid',
  BLOCKED = 'blocked'
}

const MILLISECONDS_PER_SECOND = 1000

export class Token {
  /**
   * Generate an access token
   * @param    {string}     userId        UserAuth Id
   * @param    {string}     role          UserAuth Role
   * @param    {string}     email         UserAuth Email
   * @param    {string}     mobile        UserAuth Mobile
   * @param    {boolean}    rememberMe    if `true` it will generate non-expire token
   * @return   {string}     returns authorization token for header
   */
  static createToken(userId: string, role: string, rememberMe: boolean, email?: string, mobile?: string): string {
    const jwtObject = {
      id: userId,
      email,
      mobile,
      role,
      iat: Math.floor(Date.now() / 1000)
    }
    const accessToken = rememberMe ? this.create(jwtObject) : this.create(jwtObject, expiration)
    return `Bearer ${accessToken}`
  }

  private static create(data: string | Data | Buffer, expiresIn = expiration): string {
    const secretKey: jwt.Secret = key
    const options: jwt.SignOptions = { algorithm }
    if (expiresIn) options.expiresIn = expiresIn
    const token: string = jwt.sign(data, secretKey, options)
    Redis.set(`${cachePrefix}${token}`, CACHE_KEY_TYPES.VALID)
    return token
  }

  private static decode(token: string): UserAuth | null {
    return jwt.decode(token) as UserAuth | null
  }

  static block(token: string | undefined): void {
    if (!token) throw Errors.InternalServerError(MESSAGES.INVALID_ACCESS_TOKEN)
    const decoded = this.decode(token)
    if (!decoded) throw Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    const key = `${cachePrefix}${token}`
    if (decoded.exp) {
      const expiration: number = decoded.exp - Date.now()
      Redis.multi().set(key, CACHE_KEY_TYPES.BLOCKED).expire(key, expiration).exec()
    } else {
      Redis.del(key)
    }
  }

  static renew(token: string | undefined, expire?: number): string {
    if (!token) throw Errors.InternalServerError(MESSAGES.INVALID_ACCESS_TOKEN)
    if (!allowRenew) throw Errors.MethodNotAllowed(MESSAGES.ILLEGAL_SERVICE_TOKEN)

    const now: number = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
    const decoded: UserAuth = jwt.decode(token) as UserAuth
    if (!decoded.exp) return token
    if (decoded.exp - now > renewThreshold) return token

    this.block(token)
    if (decoded.iat) delete decoded.iat
    if (decoded.exp) delete decoded.exp
    return this.create(decoded, expire || expiration)
  }

  static async isValid(token: string): Promise<UserAuth | boolean> {
    try {
      const key = `${cachePrefix}${token}`
      const value: string | null = await Redis.get(key)
      const decoded: UserAuth = jwt.decode(token) as UserAuth

      const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
      if (!decoded.exp) return decoded // token is non-expired type
      if (decoded.exp < now) return false // token is expired
      if (!value || value !== CACHE_KEY_TYPES.VALID) return false // token is revoked

      return decoded
    } catch (err) {
      logger.error(' >>> JWT Token isValid error: ', err)
      throw Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    }
  }
}
