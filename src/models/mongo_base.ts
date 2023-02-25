import mongoose, { Schema, Document } from 'mongoose'
import Errors  from 'http-errors'
import uniqueV from 'mongoose-unique-validator'
import config  from '../configs'
import { mergeDeep } from '../services/methods'
import { MESSAGES }  from '../middlewares/i18n/types'

// Typescript Base Document Model
export interface BaseDocument extends Document {
  createdAt? : number
  updatedAt? : number
  deletedAt? : number
}

export type SchemaDefinition = {
  [path: string]: mongoose.SchemaDefinitionProperty<undefined>
} | {
  [x: string]: mongoose.SchemaDefinitionProperty<any> | undefined
} | undefined

export type SchemaOptions = mongoose.SchemaOptions | undefined

const baseDefinition: SchemaDefinition = {
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 },
}

const baseOptions: SchemaOptions = {
  strict: false,  // To allow database in order to save Mixed type data in DB
}

export interface QueryData {
  page: number
  size: number
  sortType?: string
  deletedAt: number       // Always filter deleted documents
  [key: string]: any      // needs to specified later based on entity or model
}

export interface Sort {
  [key: string]: mongoose.SortOrder
}

export class BaseModel<T> {
  public schema: mongoose.Schema
  public model: mongoose.Model<any>

  constructor(schemaDefinition: SchemaDefinition, modelName: string, schemaOptions?: SchemaOptions) {
    // super()
    const definition = { ...schemaDefinition, ...baseDefinition }
    const options = schemaOptions ? { ...schemaOptions, ...baseOptions } : baseOptions
    this.schema = new Schema(definition, options)
    this.schema.plugin(uniqueV)
    this.model = mongoose.model<T>(modelName, this.schema)
  }

  async add<BaseDocument>(data: BaseDocument): Promise<BaseDocument> {
    const modelData = { ...data, createdAt: Date.now() }
    return await this.model.create<BaseDocument>(modelData)
  }

  async list<BaseDocument>(queryData: QueryData): Promise<{ total: number, list: any[] }> {
    const { page, size, sortType, ...query } = queryData
    const limit: number = (size > config.maxPageSizeLimit) ? config.maxPageSizeLimit : size
    const skip: number = (page - 1) * limit
    const sortBy: Sort = (sortType && sortType !== config.sortTypes.date)
      ? { [config.sortTypes[sortType]]: 1 }
      : { createdAt: -1 }

    // if(query.dateRange) {
    //   query.createdAt = {}
    //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
    //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
    //   delete query.dateRange
    // }
    if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const list: any[] = await this.model.find<BaseDocument>(query).limit(limit).skip(skip).sort(sortBy)
    return { total, list }
  }

  async details(modelId: string): Promise<BaseDocument> {
    const model: BaseDocument | null = await this.model.findById(modelId)
    if(!model || model.deletedAt !== 0) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return model
  }

  async updateByQuery(query: QueryData, data: Partial<BaseDocument>): Promise<BaseDocument> {
    const updatedData = { ...data, updatedAt: Date.now() }
    return await this.model.findOneAndUpdate(query, updatedData, { new: true }) as BaseDocument
  }

  async updateById(modelId: string, data: Partial<BaseDocument>): Promise<BaseDocument> {
    const model: BaseDocument = await this.details(modelId)
    model.updatedAt = Date.now()
    const updatedModelName: BaseDocument = mergeDeep(model, data) as BaseDocument
    return await this.model.findByIdAndUpdate(modelId, updatedModelName, { new: true }) as BaseDocument
  }

  async softDelete(modelId: string): Promise<BaseDocument> {
    const model: BaseDocument = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: Date.now() }, { new: true }) as BaseDocument
  }

  async remove(modelId: string): Promise<{ ok?: number, n?: number } & { deletedCount?: number }> {
    const model: BaseDocument = await this.details(modelId)
    return await this.model.deleteOne({ _id: model.id })
  }

  async restore(modelId: string): Promise<BaseDocument> {
    const model: BaseDocument = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: 0 }, { new: true }) as BaseDocument
  }

}
