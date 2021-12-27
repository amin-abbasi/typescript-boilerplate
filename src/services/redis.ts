// -------------------------------------- Initialize redis + config --------------------------------------
import { createClient } from 'redis'
import config from '../configs'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env

let url = `redis://${REDIS_HOST}:${REDIS_PORT}`
if(REDIS_PASS) url = `redis://${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`

const client = createClient({ url })

client.connect()
  .then(() => {
    console.log(`<<<< Connected to Redis >>>>`)
  })
  .catch((error: any) => {
    console.log('Redis Error: ', error)
  })

export default client
