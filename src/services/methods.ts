import { fetch, RequestInit, HeadersInit } from 'undici'
import { Errors } from '../services'
import { MESSAGES } from '../middlewares/i18n'
import { logger } from './logger'

export enum METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE'
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
  method: METHODS
  service: 'service1' | 'service2'
  baseUrl: string
  pathUrl?: string
  headers?: HeadersInit
  body?: { [key: string]: any }
  query?: { [key: string]: string }
  params?: { [key: string]: string }
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
      headers: { 'content-type': 'application/json' }
    }

    if (method !== METHODS.GET && body) init.body = JSON.stringify(body)
    if (headers) init.headers = { ...init.headers, ...headers } as HeadersInit
    if (query) URL += '?' + new URLSearchParams(query).toString()

    const response = await fetch(URL, init)
    if (!response.ok) throw await response.json()
    return {
      success: true,
      result: (await response.json()) as any
    }
  } catch (error) {
    logger.error(' ---- Rest API Error: ', error)
    throw Errors[503](MESSAGES.SERVICE_UNAVAILABLE, { data: error })
  }
}
