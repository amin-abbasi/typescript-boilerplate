import { Errors } from '../services'
import { MESSAGES } from '../middlewares/i18n'

// import * as Sample from '../models/sample-mysql'
import { Model, Sample, SampleQueryData } from '../models/mongo_sample'
import { handlerFn } from '../utils'

const exportResult = {
  // Create Sample
  create: handlerFn(async (req, res, next) => {
    const data = req.body as Sample
    const result = await Model.create(data)

    // ---- Use Socket.io
    // const io: SocketIO.Server = req.app.get('io')
    // io.emit('someEvent', { someData: '...' })

    res.result = (result as any)._doc
    next(res)
  }),

  // List all Sample
  list: handlerFn(async (req, res, next) => {
    const query: SampleQueryData = (req.query as unknown) as SampleQueryData
    const result = await Model.list(query)
    res.result = result
    next(res)
  }),

  // Show Sample Details
  details: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId
    const result = await Model.details(sampleId)

    // Get your custom method
    const message = await Model.greetings(sampleId)

    res.result = { result, message }
    next(res)
  }),

  // Update Sample
  update: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId
    const result = await Model.updateById(sampleId, req.body)
    res.result = (result as any)._doc
    next(res)
  }),

  // Archive Sample (Soft Delete)
  archive: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId
    const result = await Model.softDelete(sampleId)
    res.result = (result as any)._doc
    next(res)
  }),

  // Delete Sample From DB
  delete: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId
    const result = await Model.remove(sampleId)
    res.result = result
    next(res)
  }),

  // Secure Action For Sample
  secureAction: handlerFn(async (req, res, next) => {
    // Check Sample in Auth Header
    if (req.user.role !== 'admin') throw Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

    const sampleId: string = req.params.sampleId
    const result = await Model.details(sampleId)
    res.result = (result as any)._doc
    next(res)
  })
}

export default exportResult
