import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import config from '../configs'
import { UserAuth } from '../configs/types'
import { MESSAGES } from './i18n/types'
import { isValid }  from '../services/jwt'

// Function to set needed header auth
export async function checkToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authToken: string | undefined = req.headers.authorization?.split(' ')[1]
    if (!authToken || authToken === '') throw new Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    const user = await isValid(authToken)
    if (!user) throw new Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    req.user = user as UserAuth
    next()
  }
  catch (error) {
    console.log('Check Token Error: ', error)
    next(error)
  }
}


// Function to set needed header auth
export function checkRole(roles?: string[]): (req: Request, _res: Response, next: NextFunction) => void {
  return function(req: Request, _res: Response, next: NextFunction): void {
    try {
      const validRoles: string[] = roles ? roles : [config.roleTypes.normal]
      const user: UserAuth = req.user
      if (!user || !validRoles.includes(user.role)) throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)
      next()
    }
    catch (error) {
      console.log('Check Role Error: ', error)
      next(error)
    }
  }
}
