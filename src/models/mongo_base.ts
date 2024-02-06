import mongoose, { Schema, Document } from 'mongoose'
import uniqueV from 'mongoose-unique-validator'
import Errors from '../services/http_errors'
import config from '../configs'
import { mergeDeep } from '../utils'
import { MESSAGES } from '../middlewares/i18n'

// Typescript Base Document Model
export interface BaseDocument extends Document {
  createdAt?: number
  updatedAt?: number
  deletedAt?: number
}

export type SchemaDefinition =
  | {
      [path: string]: mongoose.SchemaDefinitionProperty<undefined>
    }
  | {
      [x: string]: mongoose.SchemaDefinitionProperty<any> | undefined
    }
  | undefined

export type SchemaOptions = mongoose.SchemaOptions | undefined

const baseDefinition: SchemaDefinition = {
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 }
}

const baseOptions = {
  strict: false // To allow database in order to save Mixed type data in DB
}

export interface QueryData {
  page: number
  size: number
  sortType?: string
  deletedAt: number // Always filter deleted documents
  [key: string]: any // needs to specified later based on entity or model
}

export interface Sort {
  [key: string]: mongoose.SortOrder
}

export class BaseModel<T extends BaseDocument> {
  #schema: mongoose.Schema
  readonly model: mongoose.Model<any>

  constructor(schemaDefinition: SchemaDefinition, modelName: string, schemaOptions?: SchemaOptions) {
    const options = schemaOptions ? { ...schemaOptions, ...baseOptions } : baseOptions
    this.#schema = new Schema({ ...schemaDefinition, ...baseDefinition }, options)
    this.#schema.plugin(uniqueV)
    this.model = mongoose.model<T>(modelName, this.#schema)
  }

  async add<T extends BaseDocument>(data: T): Promise<T> {
    const modelData = { ...data, createdAt: Date.now() }
    return await this.model.create<T>(modelData)
  }

  async list<T extends BaseDocument>(queryData: QueryData): Promise<{ total: number; list: T[] }> {
    const { page, size, sortType, ...query } = queryData
    const limit: number = size > config.maxPageSizeLimit ? config.maxPageSizeLimit : size
    const skip: number = (page - 1) * limit
    const sortBy: Sort = sortType && sortType !== config.sortTypes.date ? { [config.sortTypes[sortType]]: 1 } : { createdAt: -1 }

    // if(query.dateRange) {
    //   query.createdAt = {}
    //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
    //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
    //   delete query.dateRange
    // }
    if (query.name) query.name = { $regex: query.name, $options: 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const list: T[] = await this.model.find<T>(query).limit(limit).skip(skip).sort(sortBy)
    return { total, list }
  }

  async details<T extends BaseDocument>(modelId: string): Promise<T> {
    const model: T | null = await this.model.findById<T>(modelId)
    if (!model || model.deletedAt !== 0) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return model
  }

  async updateByQuery<T extends BaseDocument>(query: QueryData, data: Partial<T>): Promise<T> {
    const updatedData = { ...data, updatedAt: Date.now() }
    return (await this.model.findOneAndUpdate(query, updatedData, { new: true })) as T
  }

  async updateById<T extends BaseDocument>(modelId: string, data: Partial<T>): Promise<T> {
    const model: T = await this.details(modelId)
    model.updatedAt = Date.now()
    const updatedModelName: T = mergeDeep(model, data) as T
    return (await this.model.findByIdAndUpdate(modelId, updatedModelName, { new: true })) as T
  }

  async softDelete<T extends BaseDocument>(modelId: string): Promise<T> {
    const model: T = await this.details(modelId)
    return (await this.model.findByIdAndUpdate(model.id, { deletedAt: Date.now() }, { new: true })) as T
  }

  async remove<T extends BaseDocument>(modelId: string): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const model: T = await this.details(modelId)
    return await this.model.deleteOne({ _id: model.id })
  }

  async restore<T extends BaseDocument>(modelId: string): Promise<T> {
    const model: T = await this.details(modelId)
    return (await this.model.findByIdAndUpdate(model.id, { deletedAt: 0 }, { new: true })) as T
  }
}
