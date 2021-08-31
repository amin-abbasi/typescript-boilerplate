/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
// import * as SampleModel from '../models/sample-mysql'
import * as SampleModel from '../models/sample_mongo'

const exportResult = {

  // Create Sample
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: SampleModel.ISample = req.body
      const result: SampleModel.ISample = await SampleModel.add(data)

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
      const query: SampleModel.IQueryData = req.query as SampleModel.IQueryData
      const result = await SampleModel.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Sample Details
  async details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result: SampleModel.ISample = await SampleModel.details(sampleId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Sample
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await SampleModel.updateById(sampleId, req.body)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Archive Sample (Soft Delete)
  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await SampleModel.softDelete(sampleId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Sample From DB
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sampleId: string = req.params.sampleId
      const result = await SampleModel.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Secure Action For Sample
  async secureAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check User in Auth Header
      if(req.user.role !== 'admin') throw Boom.unauthorized('Invalid User.')

      const sampleId: string = req.params.sampleId
      const result: SampleModel.ISample = await SampleModel.details(sampleId)
      res.result = (result as any)._doc
      next(res)
    }
    catch (err) { next(err) }
  },

}

export default exportResult