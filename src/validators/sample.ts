import { z } from 'zod'
import { config } from '../configs'
import { validate } from '../middlewares/validator'

const isObjectId = z.string()

const exportResult = {
  // Create new Sample
  create: validate({
    body: z.object({
      name: z.string().min(1).describe('User Name'),
      age: z.number().min(1).describe('User Age')
    }),
    query: z.object({}).catchall(z.any())
  }),

  // List All Samples
  list: validate({
    query: z
      .object({
        size: z.coerce.number().default(10).describe('Sample Pagination Size'),
        page: z.coerce.number().default(1).describe('Sample Pagination Page'),
        sortType: z
          .enum(Object.keys(config.sortTypes) as [string, ...string[]])
          .optional()
          .describe('Listing Sort By')
      })
      .catchall(z.any())
  }),

  // Show Sample Details
  details: validate({
    params: z.object({
      sampleId: isObjectId.describe('Sample ID')
    }),
    query: z.object({}).catchall(z.any())
  }),

  // Update Sample
  update: validate({
    params: z.object({
      sampleId: isObjectId.describe('Sample ID')
    }),
    body: z.object({
      name: z.string().describe('User Name').optional(),
      age: z.number().describe('User Age').optional()
    }),
    query: z.object({}).catchall(z.any())
  }),

  // Delete Sample (Soft Delete)
  delete: validate({
    params: z.object({
      sampleId: isObjectId.describe('Sample ID')
    }),
    query: z.object({}).catchall(z.any())
  }),

  // Secure Action
  secureAction: validate({
    params: z.object({
      sampleId: isObjectId.describe('Sample ID')
    }),
    query: z.object({}).catchall(z.any())
  })
}

export default exportResult
