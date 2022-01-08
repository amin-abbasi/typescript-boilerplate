import mongoose, { Schema, Document } from 'mongoose'
import Boom    from '@hapi/boom'
import uniqueV from 'mongoose-unique-validator'
import config  from '../configs'
import { mergeDeep } from '../services/methods'

// Typescript Base Model
export interface IBase extends Document {
  createdAt? : number
  updatedAt? : number
  deletedAt? : number
}

export interface IBaseUpdate extends Document {
  updatedAt? : IBase['updatedAt']
}

export type SchemaDefinition = {
  [path: string]: mongoose.SchemaDefinitionProperty<undefined>
} | {
  [x: string]: mongoose.SchemaDefinitionProperty<any> | undefined
} | undefined
const baseDefinition: SchemaDefinition = {
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 },
}

export type SchemaOptions = mongoose.SchemaOptions | undefined
const baseOptions: SchemaOptions = {
  strict: false,  // To allow database in order to save Mixed type data in DB
}

export interface IQueryData {
  page: number
  size: number
  sortType: string
  deletedAt: number       // Always filter deleted documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any      // needs to specified later based on entity or model
}

export class BaseModel {
  public schema: mongoose.Schema
  public model: mongoose.Model<any>

  constructor (public definition: SchemaDefinition, public options?: SchemaOptions) {
    // super()
    this.definition = { ...this.definition, ...baseDefinition }
    this.options = this.options ? { ...this.options, ...baseOptions } : baseOptions
    this.schema = new Schema(definition, options)
    this.schema.plugin(uniqueV)
  }

  async add(data: Document): Promise <Document> {
    const modelData = { ...data, createdAt: Date.now() }
    return await this.model.create(modelData)
  }

  async list(queryData: IQueryData): Promise<{ total: number, list: IBase[] }> {
    const { page, size, sortType, ...query } = queryData
    const setSize: number = (size > config.maxPageSizeLimit) ? config.maxPageSizeLimit : size
    const sortBy = (sortType && sortType !== config.sortTypes.date) ? { [config.sortTypes[sortType]]: 1 } : { createdAt: -1 }

    // if(query.dateRange) {
    //   query.createdAt = {}
    //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
    //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
    //   delete query.dateRange
    // }
    // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const result: IBase[] = await this.model.find(query).limit(setSize).skip((page - 1) * setSize).sort(sortBy)
    return {
      total: total,
      list: result
    }
  }

  async details(modelId: string): Promise<IBase> {
    const model: IBase | null = await this.model.findById(modelId)
    if(!model || model.deletedAt !== 0) throw Boom.notFound('ModelName not found.')
    return model
  }

  async updateByQuery(query: IQueryData, data: IBaseUpdate): Promise<IBase> {
    const updatedData = { ...data, updatedAt: Date.now() }
    return await this.model.findOneAndUpdate(query, updatedData, { new: true }) as IBase
  }

  async updateById(modelId: string, data: IBaseUpdate): Promise<IBase> {
    const model: IBase = await this.details(modelId)
    model.updatedAt = Date.now()
    const updatedModelName: IBase = mergeDeep(model, data) as IBase
    return await this.model.findByIdAndUpdate(modelId, updatedModelName, { new: true }) as IBase
  }

  async softDelete(modelId: string): Promise<IBase> {
    const model: IBase = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: Date.now() }, { new: true }) as IBase
  }

  async remove(modelId: string): Promise<{ ok?: number, n?: number } & { deletedCount?: number }> {
    const model: IBase = await this.details(modelId)
    return await this.model.deleteOne({ _id: model.id })
  }

  async restore(modelId: string): Promise<IBase> {
    const model: IBase = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: 0 }, { new: true }) as IBase
  }

}

// --------------- Swagger Models Definition ---------------

/**
 * @openapi
 * components:
 *   schemas:
 *     Base:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Email for the user, needs to be unique.
 *       example:
 *         name: 'Amin'
 *         email: 'amin@gmail.com'
 */