import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import Joi  from 'joi'

interface IDataValidate {
  headers? : Joi.Schema
  body?    : Joi.Schema
  params?  : Joi.Schema
  query?   : Joi.Schema
}

function createMessage(error: Joi.ValidationError): { [key: string]: string[] } {
  const splitMessage: string[] = error.message.split('\"')
  const key: string = splitMessage[1]
  const message: string[] = [`${splitMessage[1]}${splitMessage[2]}`]
  return { [key]: message }
}

export function validate(dataValidate: IDataValidate): (req: Request, _res: Response, next: NextFunction) => void {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const { body, headers, params, query } = dataValidate
      let result: Joi.ValidationResult | undefined, errors: { [key: string]: string[] } = {}

      // 1- Check Header Validation
      if(headers) {
        result = headers.validate(req.headers)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else req.headers = result?.value        
      }

      // 2- Check Params Validation
      if(params) {
        result = params.validate(req.params)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else req.params = result?.value
      }

      // 3- Check Body Validation
      if(body) {
        result = body.validate(req.body)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else req.body = result?.value
      }

      // 4- Check Query Validation
      if(query) {
        result = query.validate(req.query)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else req.query = result?.value
      }

      if(Object.keys(errors).length !== 0) throw Boom.badRequest('Validation Error', errors)
      next()
    } catch (error) { next(error) }
  }
}
