import rateLimit from 'koa2-ratelimit'

const defaultMinutes: number = 10
const defaultMaxRequests: number = 300

/**
 * Rate Limiter Middleware
 * @param minutes         Time threshold to restart the limit, default is `10 minutes`
 * @param maxRequests     Maximum requests per second per IP address limit number, default is `300`
 * @returns returns the rate limit middleware to use in app or routes
 */
const limiter = (maxRequests?: number, minutes?: number) => rateLimit.RateLimit.middleware({
  interval: (minutes || defaultMinutes) * 60 * 1000,  // default 10 minutes
  max: maxRequests || defaultMaxRequests,             // limit each IP to 300 requests per interval
  message: `Too many requests, please try again later in ${minutes || defaultMinutes} minutes.`,
  // delayAfter: 1,                                   // begin slowing down responses after the first request
  // timeWait: 3*1000,                                // slow down subsequent responses by 3 seconds per request
  // prefixKey: 'post/user',                          // to allow the bdd to Differentiate the endpoint
  // messageKey: 'message'
})

export default limiter
