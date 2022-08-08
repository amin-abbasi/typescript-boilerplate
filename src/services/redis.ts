// -------------------------------------- Initialize redis + config --------------------------------------
// import { promisify } from 'util'
import redis  from 'redis'
import config from '../configs'

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

// const getAsync = promisify(client.get).bind(client)

client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`) })
client.on('error', err => { console.log(`>>>> Redis Error: ${err}`) })

// -------------------------------------- Redis Functions --------------------------------------
// function set(key: string, value: any): Promise<boolean> {
//   return Promise.resolve( client.set(key, JSON.stringify(value)) )
// }

// async function get(keyPattern: string): Promise<any> {
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

// const exportResult = { set, get }

// export default exportResult

export default client
