import { Request, Response } from 'express'

interface IUser {
  id:   string
  role: string
  exp:  number
  iat:  number
  email?:  string
  mobile?: string
}

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }

    interface Response {
      result: any
    }
  }
}