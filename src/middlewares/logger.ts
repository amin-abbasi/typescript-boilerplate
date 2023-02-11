import { Request, Response, NextFunction } from 'express'
import gach from 'gach'

const getProcessingTimeInMS = (time: [number, number]): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

/**
 * Print logs for API endpoints using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 *
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
        const endText = gach(`${getProcessingTimeInMS(end)}`).color('green').text
        const status = gach(res.statusCode.toString()).color('yellow').text

        if(mode === 'full') {
          const { headers, body, params, query } = req
          const request = JSON.stringify({ headers, params, query, body })
          console.log(`${timeStampText} ${method}: ${url} ${request} ${status} ${endText}`)
        } else console.log(`${timeStampText} ${method}: ${url} ${status} ${endText}`)
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
