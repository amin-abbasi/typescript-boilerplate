import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import Joi    from 'joi'
import { MESSAGES } from '../services/i18n/types'

interface ValidationErrors {
  [key: string]: string[]
}

enum REQUEST_TYPE {
  body = 'body',
  query = 'query',
  params = 'params',
  headers = 'headers'
}

type IDataValidate = {
  [key in REQUEST_TYPE]?: Joi.Schema
}

function createMessage(error: Joi.ValidationError, reqKey: string): ValidationErrors {
  const errors: ValidationErrors = {}
  for (let i = 0; i < error.details.length; i++) {
    const message: string = error.details[i].message
    const key: string = message.split('\"')[1]
    errors[key] = [ message + ` (${reqKey})` ]
  }
  return errors
}

const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key]
const setKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T, value: any) => obj[key] = value

export function validate(dataValidate: IDataValidate): (req: Request, _res: Response, next: NextFunction) => void {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      let errors: ValidationErrors = {}

      const keys: REQUEST_TYPE[] = Object.keys(dataValidate) as REQUEST_TYPE[]
      for(let i = 0; i < keys.length; i++) {
        const key: REQUEST_TYPE = keys[i]
        const schema: Joi.Schema = dataValidate[key] as Joi.Schema
        const filledData = getKeyValue<keyof Request, Request>(key)(req)
        const result: Joi.ValidationResult<any> = schema.validate(filledData, { abortEarly: false })
        if(result?.error) errors = { ...errors, ...createMessage(result.error, key) }
        else setKeyValue<keyof Request, Request>(key)(req, result?.value)
      }

      if(Object.keys(errors).length !== 0) throw Errors(400, MESSAGES.VALIDATION_ERROR, { errors })
      next()
    } catch (error) { next(error) }
  }
}
