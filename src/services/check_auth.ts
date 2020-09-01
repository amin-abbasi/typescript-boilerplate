import { Request, Response, NextFunction } from 'express'
import Boom      from '@hapi/boom'
import { jwt }   from './methods'
import config    from '../configs/config'
import { IUser } from '../../types/express'

// Function to set needed header auth
export async function checkToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authToken: string | undefined = req.headers.authorization?.split(' ')[1]
    if (!authToken || authToken === '') throw Boom.unauthorized('Invalid Token.')
    const user = await jwt.isValid(authToken)
    if (!user) throw Boom.unauthorized('Invalid Token.')
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
      if (!user || !validRoles.includes(user.role)) throw Boom.unauthorized('User is not authorized.')
      next()
    }
    catch (error) {
      console.log('Check Role Error: ', error)
      next(error)
    }
  }
}
