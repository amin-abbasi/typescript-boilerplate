import { Context, Next } from 'koa'

// Function to set needed header cors
function initCors(ctx: Context, next: Next): void {
  ctx.append('Access-Control-Allow-Origin' , '')
  ctx.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  ctx.append("Access-Control-Allow-Headers", "Origin, Accept, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, refctxh_token")
  ctx.append('Access-Control-Allow-Credentials', 'true')
  next()
}

export default initCors