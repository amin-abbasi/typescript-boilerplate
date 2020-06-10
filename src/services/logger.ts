// initialize our logger (our use-case: Winston)
import winston from 'winston'
import expressWinston from 'express-winston'

const logFormat = winston.format.printf((info) => {
  return `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`
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
