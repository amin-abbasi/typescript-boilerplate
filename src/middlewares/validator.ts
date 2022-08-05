import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import Joi  from 'joi'
import { MESSAGES } from '../services/i18n/types'

enum REQUEST_TYPE {
  body = 'body',
  query = 'query',
  params = 'params',
  headers = 'headers'
}

type IDataValidate = {
  [key in REQUEST_TYPE]?: Joi.Schema
}

function createMessage(error: Joi.ValidationError, reqKey: string): { [key: string]: string[] } {
  const errors: { [key: string]: string[] } = {}
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
      let errors: { [key: string]: string[] } = {}

      const keys: REQUEST_TYPE[] = Object.keys(dataValidate) as REQUEST_TYPE[]
      for(let i = 0; i < keys.length; i++) {
        const key: REQUEST_TYPE = keys[i]
        const data: Joi.Schema = dataValidate[key] as Joi.Schema
        const filledData = getKeyValue<keyof Request, Request>(key as any)(req)
        const result = data.validate(filledData, { abortEarly: false })
        if(result?.error) errors = { ...errors, ...createMessage(result.error, key) }
        else setKeyValue<keyof Request, Request>(key as any)(req, result?.value)
      }

      if(Object.keys(errors).length !== 0) throw Boom.badRequest(MESSAGES.VALIDATION_ERROR, errors)
      next()
    } catch (error) { next(error) }
  }
}
