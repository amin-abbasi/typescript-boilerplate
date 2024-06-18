import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import gach, { Colors } from 'gach'

import { Logger } from '../services'

enum MODE {
  SHORT = 'short',
  FULL = 'full'
}

enum LOG_TYPES {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn'
}

interface LoggerOptions {
  colored?: boolean
  mode?: MODE
  saveToFile?: boolean
  pathToSave?: string
}

class LoggerMiddleware extends Logger {
  readonly #colored: boolean
  readonly #mode: MODE
  readonly #saveToFile: boolean
  readonly #pathToSave: string

  readonly #STATUS_DATA: {
    [key: string]: { type: LOG_TYPES; color: Colors }
  } = {
    '2xx': { type: LOG_TYPES.INFO, color: 'lightGreen' },
    '3xx': { type: LOG_TYPES.WARN, color: 'lightRed' },
    '4xx': { type: LOG_TYPES.ERROR, color: 'lightYellow' },
    '5xx': { type: LOG_TYPES.ERROR, color: 'red' },
    other: { type: LOG_TYPES.ERROR, color: 'lightMagenta' }
  }

  constructor({ colored, mode, saveToFile, pathToSave }: LoggerOptions = {}) {
    super()
    this.#colored = colored ?? true
    this.#mode = mode ?? MODE.SHORT
    this.#saveToFile = saveToFile ?? true
    this.#pathToSave = pathToSave ?? path.join(__dirname, '../../logs')

    // Create the log directory if it doesn't exist
    const exists: boolean = fs.existsSync(this.#pathToSave)
    if (!exists) fs.mkdirSync(this.#pathToSave, { recursive: true })
  }

  private processTimeInMS(time: [number, number]): string {
    return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
  }

  private color(text: string, color: Colors): string {
    return gach(text).color(color).text
  }

  private statusColor(status: number): { type: LOG_TYPES; text: string } {
    const text: string = status.toString()
    let result: { type: LOG_TYPES; text: string; color: Colors } = {
      ...this.#STATUS_DATA['other'],
      text
    }
    if (status >= 200 && status < 300) result = { ...this.#STATUS_DATA['2xx'], text }
    if (status >= 300 && status < 400) result = { ...this.#STATUS_DATA['3xx'], text }
    if (status >= 400 && status < 500) result = { ...this.#STATUS_DATA['4xx'], text }
    if (status >= 500) result = { ...this.#STATUS_DATA['5xx'], text }
    if (!this.#colored) return result
    result.text = this.color(result.text, result.color)
    return result
  }

  private requestLog(req: Request): string {
    const { headers, body, params, query } = req
    return ` ${JSON.stringify({ headers, params, query, body })} `
  }

  private saveLog(log: string, type: LOG_TYPES): void {
    fs.appendFileSync(path.join(this.#pathToSave, `${type}.log`), `\n${log}`, {
      encoding: 'utf-8'
    })
  }

  get(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const { method, url } = req
        const start = process.hrtime()

        const timestamp = new Date().toISOString().replace('T', ' - ').replace('Z', '')
        const timeStampText = this.#colored ? this.color(`[${timestamp}]`, 'lightBlue') : `[${timestamp}]`

        res.once('finish', () => {
          const end = process.hrtime(start)
          const endText = this.#colored ? this.color(`${this.processTimeInMS(end)}`, 'green') : `${this.processTimeInMS(end)}`
          const status = this.statusColor(res.statusCode)
          const request: string = this.#mode === MODE.FULL ? this.requestLog(req) : ' '
          const reqMethod = this.#colored ? this.color(method, 'yellow') : method
          const log = `${timeStampText} ${reqMethod}: ${url}${request}${status.text} ${endText}`
          console.log(log)
          if (this.#saveToFile) this.saveLog(log, status.type)
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
const middleware = new LoggerMiddleware()
export default middleware.get()
