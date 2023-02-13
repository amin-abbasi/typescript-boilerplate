import { Context, Next } from 'koa'
import path from 'path'
import fs   from 'fs'
import gach from 'gach'
import { colors } from 'gach/config'

function processTimeInMS(time: [number, number]): string {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

function color(text: string, color: colors): string {
  return gach(text).color(color).text
}

enum LOG_TYPES {
  INFO  = 'info',
  ERROR = 'error',
}

type STATUS_TYPES = '2xx' | '3xx' | '4xx' | '5xx' | 'other'

interface StatusData {
  type: LOG_TYPES
  color: colors
}

const STATUS_DATA: { [key in STATUS_TYPES]: StatusData } = {
  '2xx': { type: LOG_TYPES.INFO, color: 'lightGreen' },
  '3xx': { type: LOG_TYPES.ERROR, color: 'lightRed' },
  '4xx': { type: LOG_TYPES.ERROR, color: 'lightYellow' },
  '5xx': { type: LOG_TYPES.ERROR, color: 'red' },
  other: { type: LOG_TYPES.ERROR, color: 'lightMagenta' },
}

interface StatusColor extends StatusData {
  text: string
}

function statusColor(status: number, colored: boolean): StatusColor {
  const text: string = status.toString()
  let result: StatusColor = { ...STATUS_DATA['other'], text }
  if(status >= 200 && status < 300) result = { ...STATUS_DATA['2xx'], text }
  if(status >= 300 && status < 400) result = { ...STATUS_DATA['3xx'], text }
  if(status >= 400 && status < 500) result = { ...STATUS_DATA['4xx'], text }
  if(status >= 500) result = { ...STATUS_DATA['5xx'], text }
  if(!colored) return result
  result.text = color(result.text, result.color)
  return result
}

function requestLog(ctx: Context): string {
  const { headers, body, params, query } = ctx
  return ` ${JSON.stringify({ headers, params, query, body })} `
}

function saveLog(log: string, pathToSave: string, type: LOG_TYPES): void {
  const exists: boolean = fs.existsSync(pathToSave)
  if(!exists) fs.mkdirSync(pathToSave)
  const fileName = type === LOG_TYPES.ERROR ? 'error.log' : 'info.log'
  fs.appendFileSync(path.join(pathToSave, fileName), `\n${log}`, { encoding: 'utf-8' })
}

interface LoggerOptions {
  colored: boolean
  mode: 'short' | 'full',
  saveToFile: boolean
  pathToSave: string
}

/**
 * Print logs for API endpoints using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 * @param mode mode to show extra information in log `short` or `full`
 */
function init(options: LoggerOptions): (ctx: Context, next: Next) => void {
  return function(ctx: Context, next: Next): void {
    try {
      const { mode, saveToFile, pathToSave, colored } = options
      const { method, url } = ctx, start = process.hrtime()

      const timestamp = new Date().toISOString().replace('T', ' - ').replace('Z', '')
      const timeStampText = colored ? color(`[${timestamp}]`, 'lightBlue') : `[${timestamp}]`

      ctx.res.once('finish', () => {
        const end = process.hrtime(start)
        const endText = colored ? color(`${processTimeInMS(end)}`, 'green') : `${processTimeInMS(end)}`
        const status = statusColor(ctx.status, colored)
        const request: string = mode === 'full' ? requestLog(ctx) : ' '
        const reqMethod = colored ? color(method, 'yellow') : method
        const log = `${timeStampText} ${reqMethod}: ${url}${request}${status.text} ${endText}`
        console.log(log)
        if(saveToFile) saveLog(log, pathToSave, status.type)
      })

      next()
    }
    catch (error: any) {
      console.log(color('>>>>> Log Service Error: ', 'lightRed'), error)
      ctx.error= error
      next()
    }
  }
}

// Logger Options [To be filled by developer]
const loggerOptions: LoggerOptions = {
  colored: false,
  mode: 'short',
  saveToFile: true,
  pathToSave: path.join(__dirname, '../../logs')
}

export default init(loggerOptions)

