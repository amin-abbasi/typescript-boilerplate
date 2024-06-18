import { Request, Response, NextFunction } from 'express'
import { STATUS_CODES } from 'http'
import { MESSAGES } from './i18n/types'
import { logger } from '../services'

interface MongoUniqueError {
  _message: string
  errors: any
}

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface Error extends MongoUniqueError {
  statusCode: number | string
  status?: number | string
  code?: number | string
  message: string
  data?: { [key: string]: string | boolean | unknown }
}

function transformer(err: Error, req: Request, res: Response, next: NextFunction): void {
  // mongoose-unique-validator error
  if (err._message?.includes('validation failed')) {
    err.statusCode = 400
    err.message = MESSAGES.DB_VALIDATION_FAILED
    err.data = JSON.parse(JSON.stringify(err.errors))
    logger.debug(' ------- ResDec - Mongoose-Unique-Validator ERROR:', err)
  }

  const response = res.result
    ? {
        status: '',
        statusCode: res.statusCode,
        success: typeof res.result !== 'string',
        result: res.result
      }
    : {
        statusCode: err.statusCode || err.status || err.code || 500,
        message: err.message || STATUS_CODES[500],
        errors: err.data || err.errors || null
      }

  if (typeof response.statusCode !== 'number' || response.statusCode > 600 || response.statusCode < 100) {
    response.status = response.statusCode.toString()
    response.statusCode = 500
    logger.debug(' ------- ResDec - STRING STATUS CODE:', err)
  } else delete response.status

  if (response.statusCode >= 500) logger.debug(' ------- ResDec - SERVER ERROR:', err)
  if (response.message) response.message = res.t(response.message as MESSAGES, req.language)

  res.status(response.statusCode).json(response)
  next()
}

export default transformer
