import { RedisClientOptions, createClient } from 'redis'
import { config } from '../configs'
import { logger } from './logger'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env
const url = `redis://${REDIS_PASS ? `:${REDIS_PASS}@` : ''}${REDIS_HOST}:${REDIS_PORT}`
const options: RedisClientOptions = { url }
if (REDIS_PASS) options.password = REDIS_PASS

const client = createClient(options)

client.on('error', (err: any) => {
  logger.error(`>>>> Redis Error: ${err}`)
})
logger.info(`<<<< Connected to Redis >>>>`)

export const Redis = client
