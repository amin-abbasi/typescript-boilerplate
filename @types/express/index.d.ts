import { Request, Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: {
        id:    string
        email: string
        scope: string
        exp:   number
      }
    }

    interface Response {
      result: any
    }
  }
}