import { Errors } from '../services'
import { MESSAGES } from '../middlewares/i18n'
import { Repositories } from '../database'
import { container } from 'tsyringe'
import { ISampleRepository } from '../database/repositories/sample.repository.interface'
import { handlerFn } from '../utils'
import { Sample } from '../models/core/sample'
import { BaseQueryData } from '../database/repository.interface'

function getRepo(): ISampleRepository {
  return container.resolve<ISampleRepository>(Repositories.SampleRepository)
}

const exportResult = {
  // Create Sample
  create: handlerFn(async (req, res, next) => {
    const data = req.body as Partial<Sample>
    const repo = getRepo()
    const result = await repo.add(data)

    res.result = result
    next(res)
  }),

  // List all Sample
  list: handlerFn(async (req, res, next) => {
    const query = req.query as unknown as BaseQueryData
    const repo = getRepo()
    const result = await repo.list(query)
    res.result = result
    next(res)
  }),

  // Show Sample Details
  details: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId as string
    const repo = getRepo()
    const result = await repo.details(sampleId)

    const message = await repo.greetings(sampleId)

    res.result = { result, message }
    next(res)
  }),

  // Update Sample
  update: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId as string
    const repo = getRepo()
    const result = await repo.updateById(sampleId, req.body)
    res.result = result
    next(res)
  }),

  // Archive Sample (Soft Delete)
  archive: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId as string
    const repo = getRepo()
    const result = await repo.softDelete(sampleId)
    res.result = result
    next(res)
  }),

  // Delete Sample From DB
  delete: handlerFn(async (req, res, next) => {
    const sampleId: string = req.params.sampleId as string
    const repo = getRepo()
    const result = await repo.remove(sampleId)
    res.result = result
    next(res)
  }),

  // Secure Action For Sample
  secureAction: handlerFn(async (req, res, next) => {
    // Check Sample in Auth Header
    if (req.user.role !== 'admin') throw Errors.Unauthorized(MESSAGES.UNAUTHORIZED)

    const sampleId: string = req.params.sampleId as string
    const repo = getRepo()
    const result = await repo.details(sampleId)
    res.result = result
    next(res)
  })
}

export default exportResult
