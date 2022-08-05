/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { RequestInit } from 'node-fetch'
import Boom from '@hapi/boom'
import { MESSAGES } from './i18n/types'

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

interface IResponse {
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

interface IRestData {
  method   : METHODS
  service  : 'service1' | 'service2'
  baseUrl  : string
  pathUrl? : string
  headers? : { [key: string]: string }
  body?    : { [key: string]: any }
  query?   : { [key: string]: string }
  params?  : { [key: string]: string }
}

function setError(statusCode: number, message: string, errors: any): { statusCode: number, message: string, errors: any } {
  return { statusCode, message, errors }
}

/**
 * Simple Rest API function to do something from a 3rd party
 * @param    {IRestData}    data     API data
 * @return   {Promise<IResponse>}    returns response
 */
export async function restAPI(data: IRestData): Promise<IResponse> {
  try {
    const { method, baseUrl, pathUrl, headers, body, query } = data
    let URL: string = `${baseUrl}${pathUrl || ''}`
    const init: RequestInit = {
      method,
      headers: { 'content-type': 'application/json' },
    }

    if(method !== METHODS.GET && body) init.body = JSON.stringify(body)
    if(headers) init.headers = { ...init.headers, ...headers }
    if(query) URL += ('?' + new URLSearchParams(query).toString())

    const response = await fetch(URL, init)
    const text = await response.text()
    const result = tryJSON(text)
    if(!result) return {
      success: false,
      error: setError(555, 'Invalid data to parse to JSON.', text)
    }
    if(!response.ok) return {
      success: false,
      error: setError(response.status, result.message || `${data.service} failed.`, result)
    }
    return { success: true, result }

  } catch (error: any) {
    console.log(' ---- Rest API Error: ', error)
    throw Boom.serverUnavailable(MESSAGES.SERVICE_UNAVAILABLE, error)
  }
}
