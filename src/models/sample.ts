import mongoose from 'mongoose'
import _        from 'lodash'
import Boom     from '@hapi/boom'

const Schema = mongoose.Schema

// Typescript Sample Model
export type SampleDocument = mongoose.Document & {
  name: string
  email: string
  any: any
  location: {
    country: string
    city: string
    address?: string
    coordinate?: {
      lat: number
      lon: number
    }
  }
  createdAt: number
  updatedAt?: number
  deletedAt?: number
}

// Add your own attributes in schema
const schema = new Schema({
  name:  { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  any: Schema.Types.Mixed,    // An "anything goes" SchemaType

  // Advanced Property type schema
  // location: {
  //   type: {
  //     _id: false,
  //     country: { type: Schema.Types.String, required: true },
  //     city:    { type: Schema.Types.String, required: true },
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

// -------------------------------- Set Hooks (like: 'pre') for Schema --------------------------------
// Pre Save
// schema.pre('save', async function(next) {
//   // ... Code Here ...
//   const user: any = this
//   if (!user.isModified('password')) next()
//   try {
//     const salt = await bcrypt.genSalt(config.saltHashFactor)
//     user.password = await bcrypt.hash(user.password, salt)
//     next()
//   } catch (err) {
//     next(err)
//   }
// })

// Flatten model to update (patch) partial data
// schema.pre('findOneAndUpdate', function() {
//   this._update = flat(this._update)
// })


// Choose your own model name
const ModelName: mongoose.Model<mongoose.Document, {}> = mongoose.model<SampleDocument>('ModelName', schema)

export async function add(data: object, options?: object): Promise<mongoose.Document> {
  const modelNameData: object = { ...data, createdAt: new Date().getTime() }
  return await ModelName.create(modelNameData, options)
}

export interface IQueryData {
  page: number
  size: number
  deletedAt: any
  [key: string]: any
}

export async function list(queryData: IQueryData): Promise<{ total: number; list: mongoose.Document[]; }> {
  const { page, size, ...query } = queryData
  query.deletedAt  = null

  // if(query.dateRange) {
  //   query.createdAt = {}
  //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
  //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
  //   delete query.dateRange
  // }
  // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

  const total: number  = await ModelName.countDocuments({ deletedAt: null })
  const result: mongoose.Document[] = await ModelName.find(query).limit(size).skip((page - 1) * size)
  return {
    total: total,
    list: result
  }
}

export async function details(modelNameId: string): Promise<any> {
  const modelName: any = await ModelName.findById(modelNameId)
  if(!modelName || modelName._doc.deletedAt) throw Boom.notFound('ModelName not found.')
  return modelName._doc
}

export async function updateByQuery(query: object, data: object): Promise<mongoose.Document | null> {
  const updatedData: object = { ...data, updatedAt: new Date().getTime() }
  return await ModelName.findOneAndUpdate(query, updatedData, { new: true })
}

export async function updateById(modelNameId: string, data: object): Promise<mongoose.Document | null> {
  const modelName = await details(modelNameId)
  // _.merge(modelName, data)
  modelName.updatedAt = new Date().getTime()
  return await ModelName.findByIdAndUpdate(modelNameId, { ...modelName, ...data }, { new: true })
}

export async function remove(modelNameId: string): Promise<mongoose.Document | null> {
  await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelNameId, { deletedAt: new Date().getTime() }, { new: true })
}

export async function restore(modelNameId: string): Promise<mongoose.Document | null> {
  await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelNameId, { deletedAt: null }, { new: true })
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
 *          name: 'Amin'
 *          email: 'amin@gmail.com'
 */