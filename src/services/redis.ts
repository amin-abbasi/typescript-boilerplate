// -------------------------------------- Initialize redis + config --------------------------------------

import redis  from 'redis'
import config from '../configs/config'

const { REDIS_HOST, REDIS_PORT } = config.env
const redisURL: string = `redis://${REDIS_HOST}:${REDIS_PORT}`

const client: redis.RedisClient = redis.createClient(redisURL)

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