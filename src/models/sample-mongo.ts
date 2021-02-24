import mongoose from 'mongoose'
import Boom     from '@hapi/boom'
import uniqueV from 'mongoose-unique-validator'
import { mergeDeep } from '../services/methods'

const Schema = mongoose.Schema

interface ILocation {
    country  : string
    city     : string
    address? : string
    coordinate?: {
      lat: number
      lon: number
    }
  }

// Typescript Sample Model
export interface Sample extends mongoose.Document {
  name: string
  email: string
  any?: unknown
  location?: ILocation

  createdAt? : number
  updatedAt? : number
  deletedAt? : number
}

export interface SampleUpdate extends mongoose.Document {
  name? : Sample['name']
  any?  : Sample['any']
  location?  : Sample['location']
  updatedAt? : Sample['updatedAt']
}

// Add your own attributes in schema
const schema = new Schema({
  name:  { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  any: Schema.Types.Mixed,    // An "anything goes" SchemaType

  // Advanced Property type schema
  location: {
    type: {
      _id: false,
      country: { type: Schema.Types.String, required: true },
      city:    { type: Schema.Types.String, required: true },
      address: { type: Schema.Types.String },
      coordinate: {
        type: {
          _id: false,
          lat: Schema.Types.Number,
          lon: Schema.Types.Number
        }
      }
    },
    required: true
  },

  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 },

  // , ... other properties ...
},
{
  strict: false,  // To allow database in order to save Mixed type data in DB
  // timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// Apply the Unique Property Validator plugin to schema.

schema.plugin(uniqueV, {
  type: 'mongoose-unique-validator',
  message: 'Error, expected {PATH} to be unique.'
})

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
const ModelName = mongoose.model<Sample>('ModelName', schema)

export async function add(data: Sample): Promise <Sample> {
  const modelNameData = {
    ...data,
    createdAt: new Date().getTime()
  }
  return await ModelName.create(modelNameData as Sample)
}

export interface IQueryData {
  page: number
  size: number
  deletedAt: number       // Always filter deleted documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any      // needs to specified later based on entity or model
}

export async function list(queryData: IQueryData): Promise<{ total: number, list: Sample[] }> {
  const { page, size, ...query } = queryData

  // if(query.dateRange) {
  //   query.createdAt = {}
  //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
  //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
  //   delete query.dateRange
  // }
  // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

  const total: number = await ModelName.countDocuments({ deletedAt: 0 })
  const result: Sample[] = await ModelName.find(query).limit(size).skip((page - 1) * size)
  return {
    total: total,
    list: result
  }
}

export async function details(modelNameId: string): Promise<Sample> {
  const modelName: Sample | null = await ModelName.findById(modelNameId)
  if(!modelName || modelName.deletedAt !== 0) throw Boom.notFound('ModelName not found.')
  return modelName
}

export async function updateByQuery(query: IQueryData, data: SampleUpdate): Promise<Sample | null> {
  const updatedData = { ...data, updatedAt: new Date().getTime() }
  return await ModelName.findOneAndUpdate(query, updatedData, { new: true })
}

export async function updateById(modelNameId: string, data: SampleUpdate): Promise<Sample | null> {
  const modelName: Sample = await details(modelNameId)
  modelName.updatedAt = new Date().getTime()
  const updatedModelName: Sample = mergeDeep(modelName, data) as Sample
  return await ModelName.findByIdAndUpdate(modelNameId, updatedModelName, { new: true })
}

export async function softDelete(modelNameId: string): Promise<Sample | null> {
  const modelName: Sample = await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelName.id, { deletedAt: new Date().getTime() }, { new: true })
}

export async function remove(modelNameId: string): Promise<{ ok?: number, n?: number } & { deletedCount?: number }> {
  const modelName: Sample = await details(modelNameId)
  return await ModelName.deleteOne({ _id: modelName.id })
}

export async function restore(modelNameId: string): Promise<Sample | null> {
  const modelName: Sample = await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelName.id, { deletedAt: 0 }, { new: true })
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