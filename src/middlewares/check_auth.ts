import { Request, Response, NextFunction } from 'express'
import { isValid }  from '../services/jwt'
import { IUser }    from '../../types/express'
import { MESSAGES } from '../services/i18n/types'
import Boom   from '@hapi/boom'
import config from '../configs'

// Function to set needed header auth
export async function checkToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authToken: string | undefined = req.headers.authorization?.split(' ')[1]
    if (!authToken || authToken === '') throw Boom.unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    const user = await isValid(authToken)
    if (!user) throw Boom.unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    req.user = user as IUser
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
      const user: IUser = req.user
      if (!user || !validRoles.includes(user.role)) throw Boom.unauthorized(MESSAGES.UNAUTHORIZED)
      next()
    }
    catch (error) {
      console.log('Check Role Error: ', error)
      next(error)
    }
  }
}
