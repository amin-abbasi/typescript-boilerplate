import { STATUS_CODES }  from 'http'

function decorator(err: any, req: any, res: any, next: any) {


  if(err.isBoom) {
    err.statusCode = err.output.statusCode
    err.message = err.output.payload.message
    console.log(' ------- Response Decorator - BOOM ERROR:', err)
  }

  if(err.joi) {
    err.statusCode = 400
    err.message = err.joi.details
    console.log(' ------- Response Decorator - JOI ERROR:', err)
  }

  const response = res.result ? {
    status: null,
    statusCode: res.statusCode,
    success: (typeof res.result != 'string'),
    result: res.result,
    request: {
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
      route: req.route
    }
  } : {
    statusCode: err.statusCode || (err.status || (err.code || 500)),
    message: err.message || STATUS_CODES[500],
    body: err.data || null
  }


  if(typeof response.statusCode != "number") {
    response.status = response.statusCode
    response.statusCode = 500
    console.log(' ------- Response Decorator - SERVER ERROR:', err)
  }

  if(response.statusCode >= 300) console.log(' ------- Response Decorator - SERVER ERROR:', err)

  res.status(response.statusCode).json(response)
  next()
}

export default decorator