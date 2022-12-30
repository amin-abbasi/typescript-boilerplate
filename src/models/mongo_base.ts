import mongoose, { Schema, Document } from 'mongoose'
import Errors  from 'http-errors'
import uniqueV from 'mongoose-unique-validator'
import config  from '../configs'
import { mergeDeep } from '../services/methods'
import { MESSAGES }  from '../services/i18n/types'

// Typescript Base Model
export interface BaseModel extends Document {
  createdAt? : number
  updatedAt? : number
  deletedAt? : number
}

export interface BaseModelUpdate extends Document {
  updatedAt? : BaseModel['updatedAt']
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

export interface QueryData {
  page: number
  size: number
  sortType?: string
  deletedAt: number       // Always filter deleted documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any      // needs to specified later based on entity or model
}

export interface Sort {
  [key: string]: mongoose.SortOrder
}

export class Model {
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

  async list(queryData: QueryData): Promise<{ total: number, list: BaseModel[] }> {
    const { page, size, sortType, ...query } = queryData
    const setSize: number = (size > config.maxPageSizeLimit) ? config.maxPageSizeLimit : size
    const sortBy: Sort = (sortType && sortType !== config.sortTypes.date) ? { [config.sortTypes[sortType]]: 1 } : { createdAt: -1 }

    // if(query.dateRange) {
    //   query.createdAt = {}
    //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
    //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
    //   delete query.dateRange
    // }
    // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const list: BaseModel[] = await this.model.find(query).limit(setSize).skip((page - 1) * setSize).sort(sortBy)
    return { total, list }
  }

  async details(modelId: string): Promise<BaseModel> {
    const model: BaseModel | null = await this.model.findById(modelId)
    if(!model || model.deletedAt !== 0) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return model
  }

  async updateByQuery(query: QueryData, data: BaseModelUpdate): Promise<BaseModel> {
    const updatedData = { ...data, updatedAt: Date.now() }
    return await this.model.findOneAndUpdate(query, updatedData, { new: true }) as BaseModel
  }

  async updateById(modelId: string, data: BaseModelUpdate): Promise<BaseModel> {
    const model: BaseModel = await this.details(modelId)
    model.updatedAt = Date.now()
    const updatedModelName: BaseModel = mergeDeep(model, data) as BaseModel
    return await this.model.findByIdAndUpdate(modelId, updatedModelName, { new: true }) as BaseModel
  }

  async softDelete(modelId: string): Promise<BaseModel> {
    const model: BaseModel = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: Date.now() }, { new: true }) as BaseModel
  }

  async remove(modelId: string): Promise<{ ok?: number, n?: number } & { deletedCount?: number }> {
    const model: BaseModel = await this.details(modelId)
    return await this.model.deleteOne({ _id: model.id })
  }

  async restore(modelId: string): Promise<BaseModel> {
    const model: BaseModel = await this.details(modelId)
    return await this.model.findByIdAndUpdate(model.id, { deletedAt: 0 }, { new: true }) as BaseModel
  }

}
