import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

import { Errors } from '../services'
import { MESSAGES } from './i18n/types'

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
  [key in REQUEST_TYPE]?: ZodSchema
}

function createMessage(error: ZodError, reqKey: string): ValidationErrors {
  const errors: ValidationErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'root'
    if (!errors[key]) errors[key] = []
    errors[key].push(`${issue.message} (${reqKey})`)
  }
  return errors
}

const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key]
const setKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T, value: any) =>
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true })

export function validate(schemaToValidate: SchemaToValidate): (req: Request, _res: Response, next: NextFunction) => void {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      let errors: ValidationErrors = {}

      const keys = Object.keys(schemaToValidate) as REQUEST_TYPE[]
      for (const key of keys) {
        const schema = schemaToValidate[key]
        if (!schema) continue
        const dataToValidate = getKeyValue<keyof Request, Request>(key)(req)

        const result = schema.safeParse(dataToValidate)
        if (!result.success) {
          errors = { ...errors, ...createMessage(result.error, key) }
        } else {
          setKeyValue<keyof Request, Request>(key)(req, result.data)
        }
      }

      if (Object.keys(errors).length !== 0) {
        console.error('VALIDATION ERROR:', JSON.stringify(errors, null, 2))
        throw Errors[400](MESSAGES.VALIDATION_ERROR, { errors })
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
