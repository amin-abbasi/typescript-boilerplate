import Joi from 'joi'
import { config } from '../configs'
import { validate } from '../middlewares/validator'

const objectId = Joi.string().regex(config.regex.objectId)

const exportResult = {
  // Create new Sample
  create: validate({
    body: Joi.object({
      name: Joi.string().required().description('User Name'),
      age: Joi.number().min(1).description('User Age')
    }),
    query: Joi.object({})
  }),

  // List All Samples
  list: validate({
    query: Joi.object({
      size: Joi.number().default(10).description('Sample Pagination Size'),
      page: Joi.number().default(1).description('Sample Pagination Page'),
      // name: Joi.string().max(50).description('Sample Name'),
      // userId: Joi.string().max(50).description('User ID'),
      // dateRange: Joi.object({
      //   from: Joi.date().description('Date Range From'),
      //   to:   Joi.date().description('Date Range To'),
      // }).or('from', 'to').description('Date Range'),
      sortType: Joi.string()
        .valid(...Object.keys(config.sortTypes))
        .description('Listing Sort By')
    })
  }),

  // Show Sample Details
  details: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Update Sample
  update: validate({
    // body: Joi.object({
    //   name: Joi.string().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // }),
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Delete Sample (Soft Delete)
  delete: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Secure Action
  secureAction: validate({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  })
}

export default exportResult
