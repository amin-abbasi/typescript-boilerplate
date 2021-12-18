import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import Joi  from 'joi'

interface IDataValidate {
  [key: string] : Joi.Schema
}

function createMessage(error: Joi.ValidationError): { [key: string]: string[] } {
  const splitMessage: string[] = error.message.split('\"')
  const key: string = splitMessage[1]
  return { [key]: [error.message] }
}

const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key]
const setKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T, value: any) => obj[key] = value

export function validate(dataValidate: IDataValidate): (req: Request, _res: Response, next: NextFunction) => void {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      let errors: { [key: string]: string[] } = {}

      const keys: string[] = Object.keys(dataValidate)
      keys.forEach(key => {
        const data: Joi.Schema<any> = dataValidate[key]
        const filledData = getKeyValue<keyof Request, Request>(key as any)(req)
        const result = data.validate(filledData)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else setKeyValue<keyof Request, Request>(key as any)(req, result?.value)
      })

      if(Object.keys(errors).length !== 0) throw Boom.badRequest('Validation Error', errors)
      next()
    } catch (error) { next(error) }
  }
}
