// ------ Import npm modules
// import cors    from 'cors'
import express from 'express'
import helmet  from 'helmet'
import { urlencoded, json } from 'body-parser'

const app: express.Application = express()

// ------ Initialize & Use Middle-Wares
// app.set('trust proxy', 1)
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(helmet())
// app.use(cors())

// ------ Add config to access everywhere
import config from './configs'
app.set('config', config)

// ------ Add i18n (internationalization)
import i18n from './services/i18n'
app.use(i18n)

// TODO: Add other caching systems (like 'RabbitMQ') in the future

// ------ Socket.io Integration
// import http   from 'http'
// import socket from 'socket.io'
// const server: http.Server = new http.Server(app)
// const io: socket.Server   = socket(server)
// app.set('io', io)

// ------ Allows cross-origin domains to access this API
// import initCors from './middlewares/cors'
// app.use(initCors)

// ------ Add JWT to system globally
// import jwt from 'express-jwt'
// app.use(jwt({ secret: config.jwt.key }))

// ------ Set Rate Limiter
// import limiter from './middlewares/rate_limit'
// app.use(limiter())

// ------ Add logger to system
import logger from './middlewares/logger'
app.use(logger)

// ------ Require all routes
import router from './routes'
app.use('/api', router)

// ------ Add Response Transformer (& error handler) to system
import transformer from './middlewares/transformer'
app.use(transformer)

export default app