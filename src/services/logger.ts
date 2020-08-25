// initialize our logger (our use-case: Winston)
import winston from 'winston'
import expressWinston from 'express-winston'
import config from '../configs/config'

const logFormat: winston.Logform.Format = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  let format = `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`
  if(config.env.NODE_ENV !== 'development') format = `[${info.timestamp}] ${info.level}: ${info.message}`
  return format
})

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${__dirname}/logs/app.log` })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.json(),
    logFormat
  ),
  meta: true,
  expressFormat: true,
  colorize: true,
})

export default logger
