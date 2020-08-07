// -------------------------------------- Initialize redis + config --------------------------------------

import redis  from 'redis'
import config from '../configs/config'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env
const options: redis.ClientOpts = {
  port: REDIS_PORT,         // replace with your port
  host: REDIS_HOST,         // replace with your hostname or IP address
  // password: REDIS_PASS,     // replace with your password
  // optional, if using SSL
  // use `fs.readFile[Sync]` or another method to bring these values in
  // tls       : {
  //   key  : stringValueOfKeyFile,
  //   cert : stringValueOfCertFile,
  //   ca   : [ stringValueOfCaCertFile ]
  // }
}
if(REDIS_PASS) options.password = REDIS_PASS
const client = redis.createClient(options)

// import { promisify }  from 'util'
// const getAsync  = promisify(client.get).bind(client)

client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`) })
client.on('error', err => { console.log(`Redis Error: ${err}`) })

// Redis functions
// function create(id: any, value: any, type: any) {
//   return Promise.resolve( client.set(`${type}:${id}`, JSON.stringify(value)) )
// }

// async function fetch(keyPattern: string) {
//   try {
//     const result = await getAsync(keyPattern)
//     console.log('>>>>>>>> getAsync result: ', result)
//     if(!result) return false
//     return JSON.parse(result)
//   }
//   catch (err) {
//     console.log('Redis Error - Fetch Data: ', err)
//     throw err
//   }
// }

// const exportResult = { create, fetch }

export default client