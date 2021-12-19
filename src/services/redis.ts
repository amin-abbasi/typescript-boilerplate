// -------------------------------------- Initialize redis + config --------------------------------------
import { createClient, RedisClientOptions }  from 'redis'
import config from '../configs'
// import { promisify } from 'util'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env
const options: RedisClientOptions<never, Record<string, never>> = {
  url: `${REDIS_HOST}:${REDIS_PORT}`
}
if(REDIS_PASS) options.password = REDIS_PASS

const client = createClient({})

client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`) })
client.on('error', (err: any) => { console.log(`Redis Error: ${err}`) })

// const getAsync = promisify(client.get).bind(client)

// // -------------------------------------- Redis Functions --------------------------------------
// function set(key: string, value: any): Promise<string> {
//   return new Promise((resolve, reject) => {
//     client.set(key, JSON.stringify(value), (error, reply) => {
//       if(error) reject(error)
//       resolve(reply)
//     })
//   })
// }

// async function get(keyPattern: string): Promise<any> {
//   try {
//     const result = await getAsync(keyPattern)
//     // console.log('>>>>>>>> get redis result: ', result)
//     if(!result) return false
//     return JSON.parse(result)
//   }
//   catch (err) {
//     console.log('Redis Error - Fetch Data: ', err)
//     throw err
//   }
// }

// const exportResult = { set, get }

export default client
