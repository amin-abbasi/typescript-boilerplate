/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { RequestInit } from 'node-fetch'
import config from '../configs'

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
    const response = await result.json() as IResponse
    console.log(' ---- MS-Sample Result: ', response)
    if(!result.ok) throw response
    return { success: true, result: response }
  } catch (err) {
    console.log(' ---- MS-Sample Error: ', err)
    return { success: false, error: err }
  }
}
