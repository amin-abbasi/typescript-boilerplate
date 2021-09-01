import { promisify } from 'util'
import Jwt    from 'jsonwebtoken'
import Boom   from '@hapi/boom'

import redis  from './redis'
import config from '../configs'
import { IUser } from '../../types/express'

interface IData {
  id: string
  role: string
  email?: string
  mobile?: string
}

const { algorithm, allow_renew, cache_prefix, key, expiration, renew_threshold } = config.jwt

// Creates JWT Token
export function create(data: string | IData | Buffer, expire = expiration): string {
  const secretKey: Jwt.Secret = key
  const options: Jwt.SignOptions = {
    expiresIn: expire,
    algorithm: algorithm
  }
  const token: string = Jwt.sign(data, secretKey, options)
  redis.set(`${cache_prefix}${token}`, 'valid')
  return token
}

// Creates Non Expire JWT Token (Caching is temporarily disabled)
export function createNonExpire(data: string | IData | Buffer): string {
  const token: string = Jwt.sign(data, key, {
    algorithm: algorithm
  })
  redis.set(`${cache_prefix}${token}`, 'valid')
  return token
}

// Decode Given Token from Request Headers ['authorization]
export function decode(token: string): string | { [key: string]: string | number } | null {
  return Jwt.decode(token)
}

// Blocks JWT Token from cache
export function block(token: string | undefined): void {
  if (!token) throw new Error('Token is undefined.')
  const decoded: IUser = Jwt.decode(token) as IUser
  const key = `${cache_prefix}${token}`
  if (decoded?.exp) {
    const expiration: number = decoded.exp - Date.now()
    redis.multi().set(key, 'blocked').expire(key, expiration).exec()
  } else {
    redis.del(key)
  }
}

// Renew JWT Token when is going to be expired
export function renew(token: string | undefined, expire?: number): string {
  if (!token) throw new Error('Token is undefined.')
  if (!allow_renew) throw new Error('Renewing tokens is not allowed.')

  const now: number = new Date().getTime()
  const decoded: IUser = Jwt.decode(token) as IUser
  if (!decoded.exp) return token
  if (decoded.exp - now > renew_threshold) return token

  block(token)
  if (decoded.iat) delete decoded.iat
  if (decoded.exp) delete decoded.exp
  return create(decoded, expire || expiration)
}

// Checks the validity of JWT Token
export async function isValid(token: string): Promise<IUser | boolean> {
  try {
    const key = `${cache_prefix}${token}`
    const asyncRedisGet = promisify(redis.get).bind(redis)
    const value: string | null = await asyncRedisGet(key)
    const decoded: IUser = Jwt.decode(token) as IUser

    if (decoded.exp) { // expire token

      if (decoded.exp >= new Date().getTime()) { // token is not expired yet
        if (value === 'valid') return decoded    // token is not revoked
        else return false   // token is revoked
      } else return false   // token is expired

    } else return decoded   // a non-expire token [no exp in object]

  } catch (err) {
    console.log(' >>> JWT Token isValid error: ', err)
    throw Boom.unauthorized('Invalid Token')
  }
}

/**
 * Generate an access token
 * @param    {string}     userId        User Id
 * @param    {string}     role          User Role
 * @param    {string}     email         User Email
 * @param    {string}     mobile        User Mobile
 * @param    {boolean}    rememberMe    if `true` it will generate non-expire token
 * @return   {string}     returns authorization token for header
 */
 export function createToken(userId: string, role: string, rememberMe: boolean, email?: string, mobile?: string): string {
  const jwtObject = { id: userId, email, mobile, role, iat: new Date().getTime() }
  const accessToken = rememberMe ? createNonExpire(jwtObject) : create(jwtObject)
  return `Bearer ${accessToken}`
}
