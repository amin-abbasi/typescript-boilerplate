import { Request, Response, NextFunction } from 'express'

// Function to set needed header cors
function initCors(_req: Request, res: Response, next: NextFunction): void {
  res.append('Access-Control-Allow-Origin', '')
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.append(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, refresh_token'
  )
  res.append('Access-Control-Allow-Credentials', 'true')
  next()
}

export default initCors
