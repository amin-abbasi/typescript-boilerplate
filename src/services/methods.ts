import Boom from '@hapi/boom'
import { promisify } from 'util'
import fetch, { RequestInit } from 'node-fetch'
import config from '../configs/config'
import redis  from './redis'

import Jwt from 'jsonwebtoken'
import { IUser } from '../../@types/express'

interface Label {
  label: string
}

interface Property extends Label {
  value: string | number | boolean | object | null
  id: string
}


/**
 * Find Property
 * @param   properties  array of property objects
 * @param   label       `string` label to be found in properties
 * @return  returns object of property or returns `null` if not found any
 */
export function findProp(properties: Property[], label: string): Property | null {
  for (let index: number = 0; index < properties.length; index++) {
    const property: Property = properties[index]
    if(property.label === label) return property
  }
  return null
}


/**
 * Check if an object is JSON
 * @param   object  an object to be parsed to JSON
 * @return  return valid object if it is JSON, and return `null` if it isn't
 */
export function tryJSON(object: string): object | null {
  try { return JSON.parse(object) }
  catch (e) { return null }
}

// JWT Token Functions
export const jwt = {
  // Creates JWT Token
  create(data: string | object | Buffer, expire = config.jwt.expiration) {
    const secretKey: Jwt.Secret = config.jwt.key
    const options: Jwt.SignOptions = {
      expiresIn: expire,
      algorithm: config.jwt.algorithm
    }
    const token: string = Jwt.sign(data, secretKey, options)
    const key: string = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Creates Non Expire JWT Token (Caching is temporarily disabled)
  createNonExpire(data: string | object | Buffer) : string {
    const token: string = Jwt.sign(data, config.jwt.key, { algorithm: config.jwt.algorithm })
    const key: string = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Decode Given Token from Request Headers ['authorization]
  decode(token: string): string | { [key: string]: any } | null {
    return Jwt.decode(token)
  },

  // Blocks JWT Token from cache
  block(token: string | undefined): void {
    if(!token) throw new Error('Token is undefined.')
    const decoded: IUser = <IUser>Jwt.decode(token)
    const key: string = `${config.jwt.cache_prefix}${token}`
    if(!!decoded?.exp) {
      const expiration: number = decoded.exp - Date.now()
      redis.multi().set(key, "blocked").expire(key, expiration).exec()
    }
    else {
      redis.del(key)
    }
  },

  // Renew JWT Token when is going to be expired
  renew(token: string | undefined, expire?: number): string {
    if(!token) throw new Error('Token is undefined.')
    if(!config.jwt.allow_renew) throw new Error('Renewing tokens is not allowed.')

    const now: number = new Date().getTime()
    const decoded: IUser = <IUser>Jwt.decode(token)
    if(!decoded.exp) return token
    if((decoded.exp - now) > config.jwt.renew_threshold) return token

    this.block(token)
    delete decoded.iat
    delete decoded.exp
    return this.create(decoded, expire || config.jwt.expiration)
  },

  // Checks the validity of JWT Token
  async isValid(token: string): Promise<IUser | boolean> {
    try {
      const key: string = `${config.jwt.cache_prefix}${token}`
      const asyncRedisGet = promisify(redis.get).bind(redis)
      const value: string | null = await asyncRedisGet(key)
      const decoded: IUser = <IUser>Jwt.decode(token)
      if(decoded.exp >= new Date().getTime()) {
        if(value === 'valid') return decoded
        else return false
      }
      else return false
    } catch (err) {
      console.log(' >>> isValid error: ', err)
      throw new Error('Can not validate because cache app is not responsive.')
    }
  }
}


/**
 * Generate an access token
 * @param   userId        User Id
 * @param   role          User Role
 * @param   email         User Email
 * @param   mobile        User Mobile
 * @param   rememberMe    if `true` it will generate non-expire token
 * @return  returns authorization token for header
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
  result?: any
  error?: any
}

/**
 * MS-Sample function to do something
 * @param   sampleId       Sample ID
 * @return  returns response
 */
// export async function doSomething(sampleId: string): Promise<IResponse> {
//   try {
//     const { host, port, protocol, paths } = config.MS.some_microservice
//     const url = `${protocol}://${host}:${port}${paths.doSomething}`
//     const opt: RequestInit = {
//       method: 'POST',
//       headers: { 'content-type': 'application/json' },
//       body: JSON.stringify({ sampleId })
//     }
//     const result = await fetch(url, opt)
//     const response = await result.json()
//     console.log(' ---- MS-Sample Result: ', response)
//     if(!result.ok) throw response
//     return { success: true, result: response }
//   } catch (err) {
//     console.log(' ---- MS-Sample Error: ', err)
//     return { success: false, error: err }
//   }
// }
