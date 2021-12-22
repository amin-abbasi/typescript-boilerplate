// initialize our logger (our use-case: Winston)
import expressWinston from 'express-winston'
import winston from 'winston'
import config  from '../configs'
import { IUser }  from '../../types/express'
import { decode } from '../services/jwt'

interface ILogInfo {
  userId?   : string
  target?   : string
  role?     : string
  access    : 'global' | 'non-global'
  internal? : boolean
  action    : string
}

function parseMeta(meta: any): string {
  const result: ILogInfo = { access: 'global', action: '' }

  const headers: { [key: string]: string } = meta.req.headers
  const body: { [key: string]: any } = meta.req.body
  const url: string = meta.req.url

  // Check Auth Header (userId, role[normal/admin], API Type [global/non-global])
  if(headers.authorization && headers.authorization !== '') {
    result.access = 'non-global'
    const token: string = headers.authorization.split(' ')[1]
    const user = decode(token) as IUser
    if(user) {
      result.userId = user.id
      result.role = user.role
    }
  }

  // Check if there is a user as target (userId)
  if(body && body.userId && body.userId !== '') result.target = body.userId

  // Check API_KEY Header (job)
  if(headers['api_key'] && headers['api_key'] !== '') result.internal = true

  // Set Action (based on URL entity)
  const splittedURL = url.split('/')
  result.action = splittedURL.length >= 3 ? splittedURL[3] : 'N/A'

  return JSON.stringify(result)
}

const logFormat: winston.Logform.Format = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  if(config.env.NODE_ENV !== 'development') return `[${info.timestamp}] ${info.level}: ${info.message}`
  return `[${info.timestamp}] ${JSON.stringify(info.meta)} ${parseMeta(info.meta)} ${info.level}: ${info.message}`
})

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ level: 'info', filename: `./logs/app.log` }),
    new winston.transports.File({ level: 'error', filename: `./logs/errors.log` }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    logFormat
  ),
  meta: true,
  expressFormat: true,
  colorize: true,
})

export default logger
