import * as libCurl from 'node-libcurl'
const Curl: typeof libCurl.Curl = libCurl.Curl

// POST function
export function get(url: string): Promise<any> {
  const curl: libCurl.Curl = new Curl(), close = curl.close.bind(curl)
  return new Promise((resolve, reject) => {
    //you can use a string as option
    curl.setOpt('URL', url)
    //or use an already defined constant
    // curl.setOpt(Curl.option.CONNECTTIMEOUT, 5)
    curl.setOpt(Curl.option.FOLLOWLOCATION, true)
    // Uncomment to show more debug information.
    //curl.setOpt( Curl.option.VERBOSE, true )
    //keep in mind that if you use an invalid option, a TypeError exception will be thrown

    curl.on('end', function(statusCode: number, body: string | Buffer, headers: Buffer | libCurl.HeaderInfo[]) {
      const result: object = {
        statusCode: statusCode,
        body: body,
        headers: headers,
        totalTime: this.getInfo('TOTAL_TIME')
      }
      console.info('>>>>>>>>>> CURL Result: ', result)
      resolve(result)
      close()
    })

    curl.on('error', function(err: Error, curlErrCode: libCurl.CurlCode) {
      console.error(`>>>>>>>>>> CURL ErrCode: ${curlErrCode} \n Err: ${err}`)
      reject(err)
      close()
    })

    curl.perform()
  })
}

// POST function
export function post(url: string, stringifiedData: string, headers: string[] | null): Promise<any> {
  const curl: libCurl.Curl = new Curl(), close = curl.close.bind(curl)
  return new Promise((resolve, reject) => {
    curl.setOpt(Curl.option.URL, url)
    curl.setOpt(Curl.option.POSTFIELDS, stringifiedData)
    curl.setOpt(Curl.option.HTTPHEADER, headers)
    curl.setOpt(Curl.option.VERBOSE, true)
    curl.setOpt('FOLLOWLOCATION', true)

    curl.on('end', function(statusCode: number, body: string | Buffer, headers: Buffer | libCurl.HeaderInfo[]) {
      const result: object = {
        statusCode: statusCode,
        body: body,
        headers: headers,
        totalTime: this.getInfo('TOTAL_TIME')
      }
      console.info('>>>>>>>>>> CURL Result: ', result)
      resolve(result)
      close()
    })

    curl.on('error', function(err: Error, curlErrCode: libCurl.CurlCode) {
      console.error(`>>>>>>>>>> CURL ErrCode: ${curlErrCode} \n Err: ${err}`)
      reject(err)
      close()
    })

    curl.perform()
  })
}
