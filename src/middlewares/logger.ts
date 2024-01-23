import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import gach, { COLORS } from 'gach'

type Colors = keyof typeof COLORS

enum LOG_TYPES {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn'
}

interface LoggerOptions {
  colored?: boolean
  mode?: 'short' | 'full'
  saveToFile?: boolean
  pathToSave?: string
}

class Logger {
  private readonly colored: boolean
  private readonly mode: 'short' | 'full'
  private readonly saveToFile: boolean
  private readonly pathToSave: string

  private readonly STATUS_DATA: {
    [key: string]: { type: string; color: Colors }
  } = {
    '2xx': { type: LOG_TYPES.INFO, color: 'lightGreen' },
    '3xx': { type: LOG_TYPES.WARN, color: 'lightRed' },
    '4xx': { type: LOG_TYPES.ERROR, color: 'lightYellow' },
    '5xx': { type: LOG_TYPES.ERROR, color: 'red' },
    other: { type: LOG_TYPES.ERROR, color: 'lightMagenta' }
  }

  constructor({
    colored = true,
    mode = 'short',
    saveToFile = true,
    pathToSave = path.join(__dirname, '../../logs')
  }: LoggerOptions = {}) {
    this.colored = colored
    this.mode = mode
    this.saveToFile = saveToFile
    this.pathToSave = pathToSave

    // Create the log directory if it doesn't exist
    const exists: boolean = fs.existsSync(this.pathToSave)
    if (!exists) fs.mkdirSync(this.pathToSave, { recursive: true })
  }

  private processTimeInMS(time: [number, number]): string {
    return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
  }

  private color(text: string, color: Colors): string {
    return gach(text).color(color).text
  }

  private statusColor(status: number): { type: string; text: string } {
    const text: string = status.toString()
    let result: { type: string; text: string; color: Colors } = {
      ...this.STATUS_DATA['other'],
      text
    }
    if (status >= 200 && status < 300)
      result = { ...this.STATUS_DATA['2xx'], text }
    if (status >= 300 && status < 400)
      result = { ...this.STATUS_DATA['3xx'], text }
    if (status >= 400 && status < 500)
      result = { ...this.STATUS_DATA['4xx'], text }
    if (status >= 500) result = { ...this.STATUS_DATA['5xx'], text }
    if (!this.colored) return result
    result.text = this.color(result.text, result.color)
    return result
  }

  private requestLog(req: Request): string {
    const { headers, body, params, query } = req
    return ` ${JSON.stringify({ headers, params, query, body })} `
  }

  private saveLog(log: string, type: string): void {
    const fileName = type === 'error' ? 'error.log' : 'info.log'
    fs.appendFileSync(path.join(this.pathToSave, fileName), `\n${log}`, {
      encoding: 'utf-8'
    })
  }

  public middleware(): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const { method, url } = req
        const start = process.hrtime()

        const timestamp = new Date()
          .toISOString()
          .replace('T', ' - ')
          .replace('Z', '')
        const timeStampText = this.colored
          ? this.color(`[${timestamp}]`, 'lightBlue')
          : `[${timestamp}]`

        res.once('finish', () => {
          const end = process.hrtime(start)
          const endText = this.colored
            ? this.color(`${this.processTimeInMS(end)}`, 'green')
            : `${this.processTimeInMS(end)}`
          const status = this.statusColor(res.statusCode)
          const request: string =
            this.mode === 'full' ? this.requestLog(req) : ' '
          const reqMethod = this.colored ? this.color(method, 'yellow') : method
          const log = `${timeStampText} ${reqMethod}: ${url}${request}${status.text} ${endText}`
          console.log(log)
          if (this.saveToFile) this.saveLog(log, status.type)
        })

        next()
      } catch (error) {
        console.log(this.color('>>>>> Log Error: ', 'lightRed'), error)
        next(error)
      }
    }
  }
}

// Example of usage
const logger = new Logger()
export default logger.middleware()
