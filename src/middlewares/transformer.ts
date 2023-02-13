import { Context, Next } from 'koa'
import { STATUS_CODES } from 'http'
import { MESSAGES } from './i18n/types'

interface MongoUniqueError {
  _message : string
  errors   : any
}

interface Response {
  status   : number | string
  success? : boolean
  result?  : { [key: string]: any }
  message? : string
  errors?  : any
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

  const { result, error, t, language } = ctx

  // mongoose-unique-validator error
  if(error)
    if(error._message?.includes('validation failed')) {
      error.statusCode = 400
      error.message = MESSAGES.DB_VALIDATION_FAILED
      error.data = JSON.parse(JSON.stringify(error.errors))
      console.log(' ------- ResDec - Mongoose-Unique-Validator ERROR:', error)
    }

  const response: Response = result ? {
    success : (typeof result !== 'string'),
    status  : (typeof result !== 'string') ? (result.status || (result.statusCode || 200)) : 500,
    result
  } :
  {
    status  : error?.statusCode || (error?.status || (error?.code || 500)),
    message : error?.message || STATUS_CODES[500],
    errors  : error?.data || error?.errors || null
  }

  // set status
  const status = parseInt(response.status.toString()) || 500
  console.log('>>>> status: ', status)

  if(response.message) response.message = t(response.message as MESSAGES, language)

  console.log('>>>> CTX response: ', response)

  ctx.body = null
  ctx.status = status
  ctx.type = 'application/json'
  // console.log('>>>> CTX ctx.status: ', ctx.status)
  // console.log('>>>> CTX ctx.body: ', ctx.body)
  console.log('>>>> CTX ctx.response: ', ctx.response.body)
  console.log('>>>> CTX ctx.response: ', ctx.response.status)

  ctx.response.body = response
  ctx.response.status = status
  console.log('>>>> CTX ctx.response: ', ctx.response.body)
  console.log('>>>> CTX ctx.response: ', ctx.response.status)
  // console.log('>>>> CTX ctx.res: ', ctx.res)

  next()
}

export default transformer
