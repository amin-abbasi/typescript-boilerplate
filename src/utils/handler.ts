import { NextFunction, Request, Response } from 'express'

interface HandlerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>
}

export function handlerFn(handler: HandlerFunction) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
