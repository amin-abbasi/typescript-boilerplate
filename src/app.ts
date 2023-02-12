// ------ Import npm modules
import Koa  from 'koa'
import json from 'koa-json'
import helmet from 'koa-helmet'
import bodyParser from 'koa-bodyparser'

const app: Koa = new Koa()

// ------ Initialize & Use Middle-Wares
app.use(helmet())
app.use(json())
app.use(bodyParser())

// ------ Add cors
import cors from './middlewares/cors'
app.use(cors)

// ------ Add API rate limit
// import rateLimit from './middlewares/rate_limit'
// app.use(rateLimit())

// ------ Add i18n (internationalization)
import i18n from './middlewares/i18n'
app.use(i18n)

// ------ Add logger to system
import logger from './middlewares/logger'
app.use(logger)

// ------ Require all routes
import router from './routes'
app.use(router)

// ------ Add Response Transformer (& error handler) to system
import transformer from './middlewares/transformer'
app.use(transformer)

export default app