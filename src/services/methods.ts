import { Boom } from '@hapi/boom';
import { promisify } from 'util'
import fetch, { RequestInit } from 'node-fetch'
import config from '../configs/config'
import redis  from './redis'

interface Label {
  label: string
}

interface Property extends Label {
  value: any
  id: string
}

/**
 * Find Property
 * @param   properties  array of property objects
 * @param   label       `string` label to be found in properties
 * @return  returns object of property or returns `null` if not found any
 */
export function findProp(properties: Property[], label: string): object | null {
  for (let index = 0; index < properties.length; index++) {
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
  try {
    return JSON.parse(object)
  }
  catch (e) {
    return null
  }
}

// JWT Token Functions
import Jwt from 'jsonwebtoken'
export const jwt = {
  // Creates JWT Token
  create(data: string | object | Buffer, expire = config.jwt.expiration) {
    const secretKey: Jwt.Secret = config.jwt.key
    const options: Jwt.SignOptions = {
      expiresIn: expire,
      algorithm: config.jwt.algorithm
    }
    return Jwt.sign(data, secretKey, options)
  },

  // Creates Non Expire JWT Token (Caching is temporarily disabled)
  createNonExpire(data: string | object | Buffer) : string {
    const token = Jwt.sign(data, config.jwt.key, { algorithm: config.jwt.algorithm })
    const key = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Decode Given Token from Request Headers ['authorization]
  decode(token: string): string | { [key: string]: any } | null {
    return Jwt.decode(token)
  },

  // Blocks JWT Token from cache
  block(token: string): void {
    const decoded: any = Jwt.decode(token)
    const key = `${config.jwt.cache_prefix}${token}`
    if(!!decoded?.exp) {
      const expiration = decoded.exp - Date.now()
      redis.multi().set(key, "blocked").expire(key, expiration).exec()
    }
    else {
      redis.del(key)
    }
  },

  // Renew JWT Token when is going to be expired
  renew(token: string, routePlugins: { jwtRenew: boolean | undefined }, expire: number): string {
    if(!token) throw new Error('Token is undefined')
    if((!config.jwt.allow_renew && routePlugins.jwtRenew == undefined) || (routePlugins.jwtRenew == false))
      throw new Error('Renewing tokens is not allowed')

    const decoded: any = Jwt.decode(token)
    if(!decoded.exp) return token
    if((decoded.exp - Date.now()) > config.jwt.renew_threshold) return token

    // this.block(token, decoded)
    delete decoded.iat
    delete decoded.exp
    return this.create(decoded, expire || config.jwt.expiration)
  },

  // Checks the validity of JWT Token
  async isValid(token: string): Promise<boolean> {
    try {
      const key = `${config.jwt.cache_prefix}${token}`
      const asyncRedisGet = promisify(redis.get)
      const value = await asyncRedisGet((key))
      const decoded: any = Jwt.decode(token)
      if(decoded.exp) {
        if(value === null) return true
        return false
      }
      else {
        if(value === null) return false
        return true
      }
    } catch (err) {
      throw Error('Can not validate because cache app is not responsive')
    }
  }
}


/**
 * Request Function
 * @param   url       an endpoint URL to call to
 * @param   opt       an object for request options, containing `method`, `body`, `headers`, ...
 * @param   output    output format for response: `json` or `text`
 * @return  returns request response
 */
export async function request(url: string, opt: RequestInit, output?: 'json' | 'text'): Promise<any> {
  try {
    const defaultOutput: string = output ? output : 'json'
    const res = await fetch(url, opt)
    if(!res.ok) throw new Boom(`Error response: `, { statusCode: res.status, data: opt.body })

    if(defaultOutput === "json") return res.json()
    else return res.text()

  } catch (error) {
    console.log(` >>>> Node-Fetch Error: ${error}`)
    return error
  }
}
