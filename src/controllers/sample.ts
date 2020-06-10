import _ from 'lodash'
import Sample from '../models/sample'

const exportResult = {

  // Create Sample
  async create(req: any, res: any, next: any) {
    const data = req.body
    try {
      const result = await Sample.create(data)
      res.result = result
      next(res)
    } catch (err) {
      console.log(' --------------- Create Error: ', err)
      next(err)
    }
  },

  // List all Sample
  async list(req: any, res: any, next: any) {
    const query = req.query
    try {
      const result = await Sample.list(query)
      res.result = result
      next(res)
    }
    catch (err) {
      console.log(' --------------- List Error: ', err)
      next(err)
    }
  },

  // Show Sample Details
  async details(req: any, res: any, next: any) {
    try {
      const result = await Sample.details(req.params.sampleId)
      res.result = result
      next(res)
    }
    catch (err) {
      console.log(' --------------- Details Error: ', err)
      next(err)
    }
  },

  // Update Sample
  async update(req: any, res: any, next: any) {
    const sampleId = req.params.sampleId
    try {
      const result = await Sample.updateById(sampleId, req.body)
      res.result = result
      next(res)
    }
    catch (err) {
      console.log(' --------------- Update Error: ', err)
      next(err)
    }
  },

  // Delete Sample
  async delete(req: any, res: any, next: any) {
    const sampleId = req.params.sampleId
    try {
      const result = await Sample.delete(sampleId)
      res.result = result
      next(res)
    }
    catch (err) {
      console.log(' --------------- Delete Error: ', err)
      next(err)
    }
  }
}

export default exportResult