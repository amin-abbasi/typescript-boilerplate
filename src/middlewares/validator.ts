import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import Joi  from 'joi'

interface IDataValidate {
  headers? : Joi.Schema
  body?    : Joi.Schema
  params?  : Joi.Schema
  query?   : Joi.Schema
}

export function validate(dataValidate: IDataValidate): (req: Request, _res: Response, next: NextFunction) => void {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      let result: Joi.ValidationResult | undefined

      // 1- Check Header Validation
      if(dataValidate.headers) {
        result = dataValidate.headers.validate(req.headers)
        if(result?.error) throw Boom.badRequest(result.error.message, result.error)
        else req.headers = result?.value        
      }

      // 2- Check Params Validation
      if(dataValidate.params) {
        result = dataValidate.params.validate(req.params)
        if(result?.error) throw Boom.badRequest(result.error.message, result.error)
        else req.params = result?.value
      }

      // 3- Check Body Validation
      if(dataValidate.body) {
        result = dataValidate.body.validate(req.body)
        if(result?.error) throw Boom.badRequest(result.error.message, result.error)
        else req.body = result?.value
      }

      // 4- Check Query Validation
      if(dataValidate.query) {
        result = dataValidate.query.validate(req.query)
        if(result?.error) throw Boom.badRequest(result.error.message, result.error)
        else req.query = result?.value
      }

      next()
    } catch (error) { next(error) }
  }
}
