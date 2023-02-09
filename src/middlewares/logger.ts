import { Request, Response, NextFunction } from 'express'
import gach from 'gach'

const getProcessingTimeInMS = (time: [number, number]): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

/**
 * add logs for an API endpoint using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 *
 * @param req Express.Request
 * @param res Express.Response
 * @param next Express.NextFunction
 */
function logger(req: Request, res: Response, next: NextFunction): void {

  // get timestamp
  const timestamp = new Date().toISOString().replace('T', ' - ').replace('Z', '')
  const timeStampText = gach(`[${timestamp}]`).color('lightBlue').text

  // get api endpoint
  const { method, url } = req

  // log start of the execution process
  const start = process.hrtime()

  // trigger once a response is sent to the client
  res.once('finish', () => {
    // log end of the execution process
    const end = process.hrtime(start)
    const endText = gach(`${getProcessingTimeInMS(end)}`).color('green').text
    const status = gach(res.statusCode.toString()).color('yellow').text
    console.log(`${timeStampText} ${method}: ${url} ${status} ${endText}`)
  })

  // execute next middleware/event handler
  next()
}

export default logger
