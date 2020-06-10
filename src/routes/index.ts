import express from 'express'
const router = express.Router()

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

export default router