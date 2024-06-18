import rateLimit from 'express-rate-limit'

const DEFAULT_MINUTES: number = 10
const DEFAULT_MAX_REQUEST: number = 300

/**
 * Rate Limiter Middleware
 * @param minutes         Time threshold to restart the limit, default is `10 minutes`
 * @param maxRequests     Maximum requests per second per IP address limit number, default is `300`
 * @returns returns the rate limit middleware to use in express app or routes
 */
export function limiter(maxRequests: number = DEFAULT_MAX_REQUEST, minutes: number = DEFAULT_MINUTES) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    message: `Too many requests, please try again later in ${minutes} minutes.`
  })
}
