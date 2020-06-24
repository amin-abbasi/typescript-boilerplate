import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import { jwt } from './methods'

// Function to set needed header auth
export function checkAuth(req: Request, _res: Response, next: NextFunction) : void {
  const authToken: string | undefined = req.headers['authorization']
  if(!authToken || authToken == '') throw Boom.unauthorized('User is not authorized.')

  const user: any = jwt.decode(authToken.replace('Bearer ', ''))
  if (!user) throw Boom.unauthorized('User is not authorized.')

  if (user.exp < new Date().getTime())
    throw Boom.unauthorized('Token is expired. Please login again.')

  req.user = user
  next()
}

// export default checkAuth