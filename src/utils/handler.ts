import { NextFunction, Request, Response } from 'express'

interface HandlerFunction {
  /**
   * An asynchronous function that handles an Express request.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Next function to pass control to the next middleware.
   */
  (req: Request, res: Response, next: NextFunction): Promise<void>
}

/**
 * Wraps an asynchronous route handler to catch errors and pass them to the next middleware.
 *
 * @param handler - An asynchronous function to handle the Express request.
 * @returns A function to handle the request and catch any errors.
 */
export function handlerFn(handler: HandlerFunction) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
