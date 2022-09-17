/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { STATUS_CODES } from 'http'
import { MESSAGES } from '../services/i18n/types'

interface IMongoUniqueError {
  _message : string
  errors   : any
}

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IError extends IMongoUniqueError  {
  statusCode : number | string
  status? : number | string
  code?   : number | string
  message : string
  data?   : { [key: string]: string | boolean | unknown }
}

function decorator(err: IError, req: Request, res: Response, next: NextFunction): void {

  const lang: string = req.headers['accept-language'] || req.getLocale()
  res.setLocale(lang)

  // mongoose-unique-validator error
  if(err._message?.includes('validation failed')) {
    err.statusCode = 400
    err.message = MESSAGES.DB_VALIDATION_FAILED
    err.data = JSON.parse(JSON.stringify(err.errors))
    console.log(' ------- ResDec - Mongoose-Unique-Validator ERROR:', err)
  }

  const response = res.result ? {
    status: '',
    statusCode: res.statusCode,
    success: (typeof res.result !== 'string'),
    result: res.result,
  } : {
    statusCode: err.statusCode || (err.status || (err.code || 500)),
    message: err.message || STATUS_CODES[500],
    errors: err.data || err.errors || null
  }

  if(typeof response.statusCode !== 'number') {
    response.status = response.statusCode
    response.statusCode = 500
    console.log(' ------- ResDec - STRING STATUS CODE:', err)
  } else delete response.status

  if(response.statusCode >= 500) console.log(' ------- ResDec - SERVER ERROR:', err)
  if(response.message) response.message = res.__(response.message)

  res.status(response.statusCode).json(response)
  next()
}

export default decorator