import { Context, Next } from 'koa'
import Errors from 'http-errors'
import Joi    from 'joi'
import { MESSAGES } from '../middlewares/i18n/types'

enum REQUEST_TYPE {
  body = 'body',
  query = 'query',
  params = 'params',
  headers = 'headers'
}

type ValidationErrors = {
  [key: string]: string[]
}

type SchemaToValidate = {
  [key in REQUEST_TYPE]?: Joi.Schema
}

function createMessage(error: Joi.ValidationError, ctxKey: string): ValidationErrors {
  const errors: ValidationErrors = {}
  for (let i = 0; i < error.details.length; i++) {
    const message: string = error.details[i].message
    const key: string = message.split('\"')[1]
    errors[key] = [ message + ` (${ctxKey})` ]
  }
  return errors
}

const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key]
const setKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T, value: any) => obj[key] = value

export function validate(schemaToValidate: SchemaToValidate): (ctx: Context, next: Next) => void {
  return async function (ctx: Context, next: Next): Promise<void> {
    try {
      let errors: ValidationErrors = {}

      const keys: REQUEST_TYPE[] = Object.keys(schemaToValidate) as REQUEST_TYPE[]
      for(let i = 0; i < keys.length; i++) {
        const key: REQUEST_TYPE = keys[i]
        const schema: Joi.Schema = schemaToValidate[key] as Joi.Schema
        const dataToValidate = getKeyValue<keyof Context, Context>(key)(ctx)
        const { error, value } = schema.validate(dataToValidate, { abortEarly: false })
        if(error) errors = { ...errors, ...createMessage(error, key) }
        else setKeyValue<keyof Context, Context>(key)(ctx, value)
      }

      if(Object.keys(errors).length !== 0) throw Errors(400, MESSAGES.VALIDATION_ERROR, { errors })
      next()
    } catch (error: any) {
      console.error('>>>>> Validator Service Error: ', error)
      ctx.error= error
      next()
    }
  }
}
