/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import got, { OptionsOfTextResponseBody } from 'got'

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

interface IResponse {
  success: boolean
  result?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  error?: unknown
}

interface IRestData {
  method   : 'GET' | 'POST' | 'PUT' | 'DELETE'
  baseUrl  : string
  pathUrl? : string
  headers? : { [key: string]: string }
  body?    : { [key: string]: any }
  query?   : { [key: string]: string }
  params?  : { [key: string]: string }
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
    const opt: OptionsOfTextResponseBody = {
      method,
      headers: { 'content-type': 'application/json' },
    }

    if(body) opt.body = JSON.stringify(body)
    if(headers) opt.headers = { ...opt.headers, ...headers }
    if(query) URL += ('?' + new URLSearchParams(query).toString())

    const result = await got(URL, opt)
    console.log(' ---- Rest API Result: ', result)

    return { success: true, result }
    
  } catch (error) {
    console.log(' ---- Rest API Error: ', error)
    return { success: false, error }
  }
}
