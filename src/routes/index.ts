import { errors } from 'celebrate'
import express from 'express'
const router = express.Router()

// ------ Add JWT to chosen routes
// import jwt    from 'express-jwt'
// import config from '../configs/config'
// const JwtCheck = jwt({ secret: config.jwt.key })
// router.use('/v1/samples', JwtCheck, sampleRouter)

// Sample APIs
import sampleRouter from './sample'
router.use('/v1/samples', sampleRouter)

// API Documentation Swagger
import swaggerUi  from 'swagger-ui-express'
import * as specs from '../services/swagger'
router.use('/docs', swaggerUi.serve)
router.get('/docs', swaggerUi.setup(specs, { explorer: true }))

// Health-check Endpoint
router.get('/health', (_req, res) => { res.send('200') })

router.use(errors())

export default router