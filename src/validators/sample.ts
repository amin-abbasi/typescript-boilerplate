import { celebrate, Joi } from 'celebrate'
// import _ from 'lodash'

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

const exportResult = {

  // Create new Sample
  create: celebrate({
    // body: {
    //   name: Joi.string().required().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // },
    query: {}
  }),

  // List All Samples
  list: celebrate({
    query: {
      size: Joi.number().default(10).description('Sample Pagination Size'),
      page: Joi.number().default(1).description('Sample Pagination Page'),
      // name: Joi.string().max(50).description('Sample Name'),
      // userId: Joi.string().max(50).description('User ID'),
      // dateRange: Joi.object({
      //   from: Joi.date().description('Date Range From'),
      //   to:   Joi.date().description('Date Range To'),
      // }).or('from', 'to').description('Date Range'),
    }
  }),

  // Show Sample Details
  details: celebrate({
    params: {
      sampleId: objectId.required().description('Sample ID')
    },
    query: {}
  }),

  // Update Sample
  update: celebrate({
    // body: {
    //   name: Joi.string().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // },
    params: {
      sampleId: objectId.required().description('Sample ID')
    },
    query: {}
  }),

  // Delete Sample (Soft Delete)
  delete: celebrate({
    params: {
      sampleId: objectId.required().description('Sample ID')
    },
    query: {}
  }),

  // Secure Action
  secureAction: celebrate({
    params: {
      sampleId: objectId.required().description('Sample ID')
    },
    query: {}
  }),

}

export default exportResult