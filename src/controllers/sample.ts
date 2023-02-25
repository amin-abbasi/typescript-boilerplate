import { Context, Next } from 'koa'
import Errors from 'http-errors'
import { MESSAGES } from '../middlewares/i18n/types'

// import * as Sample from '../models/sample-mysql'
import * as Model from '../models/mongo_sample'
import { QueryData } from '../models/mongo_base'

const exportResult = {
  // Create Sample
  async create(ctx: Context, next: Next): Promise<void> {
    try {
      const data = <Model.Sample>ctx.request.body
      const result = await Model.default.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = ctx.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      ctx.result = (result as any)._doc
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // List all Sample
  async list(ctx: Context, next: Next): Promise<void> {
    try {
      const query: QueryData = ctx.query as QueryData
      const result = await Model.default.list(query)
      ctx.result = result
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // Show Sample Details
  async details(ctx: Context, next: Next): Promise<void> {
    try {
      const sampleId: string = ctx.params.sampleId
      // const result = await Model.details(sampleId)

      // Get your custom method
      const result = await Model.default.greetings(sampleId)

      ctx.result = (result as any)._doc
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // Update Sample
  async update(ctx: Context, next: Next): Promise<void> {
    try {
      const sampleId: string = ctx.params.sampleId
      const data = ctx.request.body as Model.SampleUpdate
      const result = await Model.default.updateById(sampleId, data)
      ctx.result = (result as any)._doc
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // Archive Sample (Soft Delete)
  async archive(ctx: Context, next: Next): Promise<void> {
    try {
      const sampleId: string = ctx.params.sampleId
      const result = await Model.default.softDelete(sampleId)
      ctx.result = (result as any)._doc
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // Delete Sample From DB
  async delete(ctx: Context, next: Next): Promise<void> {
    try {
      const sampleId: string = ctx.params.sampleId
      const result = await Model.default.remove(sampleId)
      ctx.result = result as any
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  },

  // Secure Action For Sample
  async secureAction(ctx: Context, next: Next): Promise<void> {
    try {
      // Check Sample in Auth Header
      if (ctx.user.role !== 'admin')
        throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

      const sampleId: string = ctx.params.sampleId
      const result = await Model.default.details(sampleId)
      ctx.result = (result as any)._doc
      await next()
    } catch (error: any) {
      ctx.error = error
      await next()
    }
  }
}

export default exportResult
