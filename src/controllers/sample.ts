import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import * as Sample from '../models/sample'

const exportResult = {

  // Create Sample
  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    try {
      const result = await Sample.add(data)
      res.result = result
      next(res)
    } catch (err) { next(err) }
  },

  // List all Sample
  async list(req: Request, res: Response, next: NextFunction) {
    const query = req.query
    try {
      const result = await Sample.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Sample Details
  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Sample.details(req.params.sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Sample
  async update(req: Request, res: Response, next: NextFunction) {
    const sampleId = req.params.sampleId
    try {
      const result = await Sample.updateById(sampleId, req.body)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Sample
  async delete(req: Request, res: Response, next: NextFunction) {
    const sampleId = req.params.sampleId
    try {
      const result = await Sample.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  }
}

export default exportResult