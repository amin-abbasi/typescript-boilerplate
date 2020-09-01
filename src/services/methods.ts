import fetch, { RequestInit } from 'node-fetch'
import { promisify } from 'util'
import Jwt    from 'jsonwebtoken'
import config from '../configs/config'
import redis  from './redis'

import { IUser } from '../../types/express'

interface IData {
  id: string
  role: string
  email?: string
  mobile?: string
}

/**
 * Check if an object is JSON
 * @param   object  an object to be parsed to JSON
 * @return  return valid object if it is JSON, and return `null` if it isn't
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tryJSON(object: string): any {
  try { return JSON.parse(object) }
  catch (e) { return null }
}

// JWT Token Functions
export const jwt = {
  // Creates JWT Token
  create(data: string | IData | Buffer, expire = config.jwt.expiration): string {
    const secretKey: Jwt.Secret = config.jwt.key
    const options: Jwt.SignOptions = {
      expiresIn: expire,
      algorithm: config.jwt.algorithm
    }
    const token: string = Jwt.sign(data, secretKey, options)
    const key = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Creates Non Expire JWT Token (Caching is temporarily disabled)
  createNonExpire(data: string | IData | Buffer): string {
    const token: string = Jwt.sign(data, config.jwt.key, {
      algorithm: config.jwt.algorithm
    })
    const key = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Decode Given Token from Request Headers ['authorization]
  decode(token: string): string | { [key: string]: string | number } | null {
    return Jwt.decode(token)
  },

  // Blocks JWT Token from cache
  block(token: string | undefined): void {
    if (!token) throw new Error('Token is undefined.')
    const decoded: IUser = Jwt.decode(token) as IUser
    const key = `${config.jwt.cache_prefix}${token}`
    if (decoded?.exp) {
      const expiration: number = decoded.exp - Date.now()
      redis.multi().set(key, 'blocked').expire(key, expiration).exec()
    } else {
      redis.del(key)
    }
  },

  // Renew JWT Token when is going to be expired
  renew(token: string | undefined, expire?: number): string {
    if (!token) throw new Error('Token is undefined.')
    if (!config.jwt.allow_renew) throw new Error('Renewing tokens is not allowed.')

    const now: number = new Date().getTime()
    const decoded: IUser = Jwt.decode(token) as IUser
    if (!decoded.exp) return token
    if (decoded.exp - now > config.jwt.renew_threshold) return token

    this.block(token)
    if (decoded.iat) delete decoded.iat
    if (decoded.exp) delete decoded.exp
    return this.create(decoded, expire || config.jwt.expiration)
  },

  // Checks the validity of JWT Token
  async isValid(token: string): Promise<IUser | boolean> {
    try {
      const key = `${config.jwt.cache_prefix}${token}`
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
      console.log(' >>> isValid error: ', err)
      throw new Error('Can not validate because cache app is not responsive.')
    }
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
export function setToken(userId: string, role: string, rememberMe: boolean, email?: string, mobile?: string): string {
  const jwtObject = {
    id: userId,
    email: email,
    mobile: mobile,
    role: role,
    iat: new Date().getTime()
  }
  const accessToken = rememberMe ? jwt.createNonExpire(jwtObject) : jwt.create(jwtObject)
  return `Bearer ${accessToken}`
}


interface IResponse {
  success: boolean
  result?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  error?: unknown
}
/**
 * MS-Sample function to do something
 * @param    {string}    sampleId    Sample ID
 * @return   {Promise<IResponse>}    returns response
 */
export async function doSomething(sampleId: string): Promise<IResponse> {
  try {
    const { url, paths } = config.MS.some_microservice
    const URL = `${url}${paths.doSomething}`
    const opt: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sampleId })
    }
    const result = await fetch(URL, opt)
    const response = await result.json()
    console.log(' ---- MS-Sample Result: ', response)
    if(!result.ok) throw response
    return { success: true, result: response }
  } catch (err) {
    console.log(' ---- MS-Sample Error: ', err)
    return { success: false, error: err }
  }
}
