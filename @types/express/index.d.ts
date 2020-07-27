import { Request, Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: {
        id:   string
        role: string
        exp:  number
        iat:  number
        email?:  string
        mobile?: string
      }
    }

    interface Response {
      result: any
    }
  }
}