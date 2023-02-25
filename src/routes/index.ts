import { Context } from 'koa'
import Router from 'koa-router'
const router: Router = new Router()

// Health-check Endpoint
router.get('/health', (ctx: Context) => { ctx.body = '200!' })

// Sample APIs
import sampleRouter from './sample'
router.use(sampleRouter).allowedMethods()

export default router.routes()
