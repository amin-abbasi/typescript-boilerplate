import { Request, Response, NextFunction } from 'express'
// import _ from 'lodash'
import Boom from '@hapi/boom'
import * as Sample from '../models/sample'

const exportResult = {

  // Create Sample
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: Sample.ISampleDocument = req.body
      const result: Sample.ISampleDocument = await Sample.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      res.result = result
      next(res)
    } catch (err) { next(err) }
  },

  // List all Sample
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query: Sample.IQueryData = req.query as Sample.IQueryData
      const result: { total: number, list: Sample.ISampleDocument[] } = await Sample.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Sample Details
  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const sampleId: string = req.params.sampleId
      const result: Sample.ISampleDocument = await Sample.details(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Sample
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sampleId: string = req.params.sampleId
      const result: Sample.ISampleDocument | null = await Sample.updateById(sampleId, req.body)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Sample
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const sampleId: string = req.params.sampleId
      const result: Sample.ISampleDocument | null = await Sample.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Secure Action For Sample
  async secureAction(req: Request, res: Response, next: NextFunction) {
    try {
      // Check User in Auth Header
      if(req.user.role !== 'admin') throw Boom.unauthorized('Invalid User.')

      const sampleId: string = req.params.sampleId
      const result: Sample.ISampleDocument | null = await Sample.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

}

export default exportResult