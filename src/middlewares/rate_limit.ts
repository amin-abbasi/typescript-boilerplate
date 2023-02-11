import rateLimit from 'express-rate-limit'

const defaultMinutes: number = 10
const defaultMaxRequests: number = 300

/**
 * Rate Limiter Middleware
 * @param minutes         Time threshold to restart the limit, default is `10 minutes`
 * @param maxRequests     Maximum requests per second per IP address limit number, default is `300`
 * @returns returns the rate limit middleware to use in express app or routes
 */
const limiter = (maxRequests?: number, minutes?: number) => rateLimit({
  windowMs: (minutes || defaultMinutes) * 60 * 1000,  // default 10 minutes
  max: maxRequests || defaultMaxRequests,             // limit each IP to 300 requests per windowMs
  message: `Too many requests, please try again later in ${minutes || defaultMinutes} minutes.`
})

export default limiter
