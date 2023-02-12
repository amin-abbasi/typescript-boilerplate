import { Context, Next } from 'koa'
import { STATUS_CODES } from 'http'
import { MESSAGES } from './i18n/types'

interface MongoUniqueError {
  _message : string
  errors   : any
}

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface ResponseError extends MongoUniqueError  {
  statusCode : number | string
  status? : number | string
  code?   : number | string
  message : string
  data?   : { [key: string]: string | boolean | unknown }
}


//  !! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX !!
// FIXME: CTX response needs to be used!!!
// TODO: use ctx.response in transformer
//  !! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX !!


function transformer(ctx: Context, next: Next): void {

  const error = ctx.error as ResponseError
  console.log('>>>> Init CTX: ', ctx)

  // mongoose-unique-validator error
  if(error)
    if(error._message?.includes('validation failed')) {
      error.statusCode = 400
      error.message = MESSAGES.DB_VALIDATION_FAILED
      error.data = JSON.parse(JSON.stringify(error.errors))
      console.log(' ------- ResDec - Mongoose-Unique-Validator ERROR:', error)
    }

  const response = ctx.result ?
    {
      status: '',
      statusCode: ctx.status,
      success: (typeof ctx.result !== 'string'),
      result: ctx.result,
    } : error ?
    {
      statusCode: error.statusCode || (error.status || (error.code || 500)),
      message: error.message || STATUS_CODES[500],
      errors: error.data || error.errors || null
    } :
    {
      statusCode: 500,
      message: STATUS_CODES[500],
      errors: ctx.body
    }

  if(typeof response.statusCode !== 'number' || response.statusCode > 600 || response.statusCode < 100) {
    response.status = response.statusCode.toString()
    response.statusCode = 500
    console.log(' ------- ResDec - STRING STATUS CODE: ', error)
  } else delete response.status

  if(response.statusCode >= 500) console.log(' ------- ResDec - SERVER ERROR: ', error)
  if(response.message) response.message = ctx.t(response.message as MESSAGES, ctx.language)

  ctx.status = response.statusCode
  ctx.body = response
  next()
}

export default transformer
