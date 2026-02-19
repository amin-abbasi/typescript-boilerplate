import { RedisClientOptions, createClient } from 'redis'
import { config } from '../configs'
import { logger } from './logger'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env
const url = `redis://${REDIS_PASS ? `:${REDIS_PASS}@` : ''}${REDIS_HOST || 'localhost'}:${REDIS_PORT || 6379}`
const options: RedisClientOptions = { url }
if (REDIS_PASS) options.password = REDIS_PASS

const client = createClient(options)

client.on('error', (err: any) => {
  logger.error(`>>>> Redis Error: ${err}`)
})

/**
 * Connect to Redis. Call this during server startup.
 * Safe to skip if Redis is not configured.
 */
export async function initRedis(): Promise<void> {
  if (!REDIS_HOST) {
    logger.warn('<<<< Redis is not configured, skipping connection >>>>')
    return
  }
  await client.connect()
  logger.info(`<<<< Connected to Redis >>>>`)
}

export const Redis = client
