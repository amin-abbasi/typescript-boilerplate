import { Request, Response, NextFunction } from 'express'
import gach from 'gach'
import { colors } from 'gach/config'

const processTimeInMS = (time: [number, number]): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

const color = (text: string, color: colors): string => gach(text).color(color).text

const statusColor = (status: number): string => {
  if(status >= 200 && status < 300) return gach(status.toString()).color('lightGreen').text
  if(status >= 300 && status < 400) return gach(status.toString()).color('lightRed').text
  if(status >= 400 && status < 500) return gach(status.toString()).color('lightYellow').text
  if(status >= 500) return gach(status.toString()).color('red').text
  return gach(status.toString()).color('red').text
}

/**
 * Print logs for API endpoints using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 * @param mode mode to show extra information in log `short` or `full`
 */
export function logger(mode: 'short' | 'full' = 'short'): (req: Request, res: Response, next: NextFunction) => void {
  return function(req: Request, res: Response, next: NextFunction): void {
    try {
      const { method, url } = req, start = process.hrtime()

      const timestamp = new Date().toISOString().replace('T', ' - ').replace('Z', '')
      const timeStampText = gach(`[${timestamp}]`).color('lightBlue').text

      res.once('finish', () => {
        const end = process.hrtime(start)
        const endText = gach(`${processTimeInMS(end)}`).color('green').text
        const status = statusColor(res.statusCode)

        if(mode === 'full') {
          const { headers, body, params, query } = req
          const request = JSON.stringify({ headers, params, query, body })
          console.log(`${timeStampText} ${color(method, 'yellow')}: ${url} ${request} ${status} ${endText}`)
        } else console.log(`${timeStampText} ${color(method, 'yellow')}: ${url} ${status} ${endText}`)
      })

      next()
    }
    catch (error) {
      console.log(gach('>>>>> Log Error: ').color('lightRed').text, error)
      next(error)
    }
  }
}

export default logger
