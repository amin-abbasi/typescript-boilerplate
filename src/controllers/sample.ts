import { Request, Response, NextFunction } from 'express'
import Errors from 'http-errors'
import { MESSAGES } from '../middlewares/i18n/types'

// import * as Sample from '../models/sample-mysql'
import Model from '../models/mongo_sample'
import { QueryData } from '../models/mongo_base'

const exportResult = {

  // Create Sample
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body
      const result = await Model.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      res.result = (result as any)._doc
      next(res)
    } catch (err) { next(err) }
  },

  // List all Sample
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: QueryData = req.query as QueryData
      const result = await Model.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Sample Details
  async details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      // const result = await Model.details(sampleId)

      // Get your custom method
      const result = await Model.greetings(sampleId)

      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Sample
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await Model.updateById(sampleId, req.body)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Archive Sample (Soft Delete)
  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await Model.softDelete(sampleId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Sample From DB
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await Model.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Secure Action For Sample
  async secureAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check Sample in Auth Header
      if(req.user.role !== 'admin') throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

      const sampleId: string = req.params.sampleId
      const result = await Model.details(sampleId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

}

export default exportResult