import { fetch, RequestInit, HeadersInit } from 'undici'
import Errors from 'http-errors'
import { MESSAGES } from '../middlewares/i18n/types'

/**
 * Check if an object is JSON or not
 * @param   object  an object to be parsed to JSON
 * @return  return `true` if it is JSON, and return `false` if it isn't
 */
export function tryJSON(object: string): false | Record<string, any> {
  try { return JSON.parse(object) as Record<string, any> }
  catch (e) { return false }
}

/**
 * Set Unique Array Function
 * @param array array of string to be checked
 */
export function setUniqueArray(array: string[]): string[] {
  return array.filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

export enum METHODS {
  POST   = 'POST',
  GET    = 'GET',
  PUT    = 'PUT',
  DELETE = 'DELETE',
}

interface Response {
  success: boolean
  result?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  error?: {
		statusCode: number
		message: string
		errors: any
	}
}

interface RestData {
  method   : METHODS
  service  : 'service1' | 'service2'
  baseUrl  : string
  pathUrl? : string
  headers? : HeadersInit
  body?    : { [key: string]: any }
  query?   : { [key: string]: string }
  params?  : { [key: string]: string }
}

/**
 * Simple Rest API function to do something from a 3rd party
 * @param    {RestData}    data     API data
 * @return   {Promise<Response>}    returns response
 */
export async function restAPI(data: RestData): Promise<Response> {
  try {
    const { method, baseUrl, pathUrl, headers, body, query } = data
    let URL: string = `${baseUrl}${pathUrl || ''}`
    const init: RequestInit = {
      method,
      headers: { 'content-type': 'application/json' },
    }

    if(method !== METHODS.GET && body) init.body = JSON.stringify(body)
    if(headers) init.headers = { ...init.headers, ...headers } as HeadersInit
    if(query) URL += ('?' + new URLSearchParams(query).toString())

    const response = await fetch(URL, init)
    if(!response.ok) throw await response.json()
    return {
      success: true,
      result: await response.json() as any
    }
  } catch (error: any) {
    console.log(' ---- Rest API Error: ', error)
    throw Errors(503, MESSAGES.SERVICE_UNAVAILABLE, { data: error })
  }
}
