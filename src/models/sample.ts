import mongoose from 'mongoose'
import _        from 'lodash'
import Boom     from '@hapi/boom'

const Schema = mongoose.Schema

// Add your own attributes in schema
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  any: Schema.Types.Mixed,    // An "anything goes" SchemaType

  // Advanced Property type schema
  // location: {
  //   type: {
  //     _id: false,
  //     address: { type: Schema.Types.String },
  //     coordinate: {
  //       type: {
  //         _id: false,
  //         lat: Schema.Types.Number,
  //         lon: Schema.Types.Number
  //       }
  //     }
  //   },
  //   required: true
  // },

  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: null },

  // , ... other properties ...
},
{
  strict: false,  // To allow database in order to save Mixed type data in DB
  // timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// Apply the Unique Property Validator plugin to schema.
// import uniqueV from 'mongoose-unique-validator'
// schema.plugin(uniqueV, { type: 'mongoose-unique-validator' })

// ------------------------------------- Set Hooks (like: 'pre') for Schema -------------------------------------
// schema.pre('save', function(next) {
//   ... Code Here ...
//   next()
// })

// Flatten model to update (patch) partial data
// schema.pre('findOneAndUpdate', function() {
//   this._update = flat(this._update)
// })


// Choose your own model name
const ModelName = mongoose.model('ModelName', schema)

export async function add(data: object, options?: object): Promise<any> {
  const modelNameData = { ...data, createdAt: new Date().getTime() }
  return await ModelName.create(modelNameData, options)
}

export async function list(query?: any): Promise<any> {
  if(!query) query = {}
  query.deletedAt = null
  const result = await ModelName.find(query)
  return {
    total: result.length,
    list: result
  }
}

export async function details(modelNameId: string): Promise<any> {
  const modelName: any = await ModelName.findById(modelNameId)
  if(!modelName || modelName._doc.deletedAt) throw Boom.notFound('ModelName not found.')
  return modelName._doc
}

export async function updateByQuery(query: object, data: object): Promise<any> {
  const updatedData = { ...data, updatedAt: new Date().getTime() }
  const result = await ModelName.findOneAndUpdate(query, updatedData, { new: true })
  return result
}

export async function updateById(modelNameId: string, data: any): Promise<any> {
  const modelName = await details(modelNameId)
  // _.merge(modelName, data)
  modelName.updatedAt = new Date().getTime()
  return ModelName.findByIdAndUpdate(modelNameId, { ...modelName, ...data }, { new: true })
}

export async function remove(modelNameId: string): Promise<any> {
  await details(modelNameId)
  return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: new Date().getTime() }, { new: true })
}

export async function restore(modelNameId: string): Promise<any> {
  await details(modelNameId)
  return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: null }, { new: true })
}

// --------------- Swagger Models Definition ---------------

/**
 * @swagger
 *  components:
 *    schemas:
 *      Sample:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Amin
 *           email: amin@gmail.com
 */