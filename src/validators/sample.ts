import { celebrate, Joi } from 'celebrate'
import _ from 'lodash'

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
    query: {}
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
  })
}

export default exportResult