// import * as libCurl from 'node-libcurl'
// const curl: libCurl.Curl = new libCurl.Curl(), close = curl.close.bind(curl)
// const { FOLLOWLOCATION, URL, POSTFIELDS, HTTPHEADER, VERBOSE } = libCurl.Curl.option

// interface CurlData {
//   url: string
//   method: 'GET' | 'POST'
//   stringifiedData?: string
//   headers?: string[] | null
// }
// interface CurlResponse {
//   statusCode : number
//   body       : string | Buffer
//   headers    : Buffer | libCurl.HeaderInfo[]
//   totalTime  : string | number | null
// }

// // CURL function
// export function CURL(data: CurlData): Promise<CurlResponse> {
//   return new Promise((resolve, reject) => {
//     const { url, method, stringifiedData, headers } = data
//     curl.setOpt(URL, url)
//     curl.setOpt(FOLLOWLOCATION, true)

//     if(method === 'POST' && stringifiedData && headers) {
//       curl.setOpt(POSTFIELDS, stringifiedData)
//       curl.setOpt(HTTPHEADER, headers)
//       curl.setOpt(VERBOSE, true)
//     }

//     curl.on('end', function(statusCode: number, body: string | Buffer, headers: Buffer | libCurl.HeaderInfo[]) {
//       const totalTime = this.getInfo('TOTAL_TIME')
//       const result: CurlResponse = { statusCode, body, headers, totalTime }
//       console.info('>>>>>>>>>> CURL Result: ', result)
//       resolve(result)
//       close()
//     })

//     curl.on('error', function(err: Error, curlErrCode: libCurl.CurlCode) {
//       console.error(`>>>>>>>>>> CURL ErrCode: ${curlErrCode} \n Err: ${err}`)
//       reject(err)
//       close()
//     })

//     curl.perform()
//   })
// }
