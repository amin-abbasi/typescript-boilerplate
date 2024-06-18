import mongoose from 'mongoose'
import { Errors, logger } from '../services'
import { BaseDocument, BaseModel, SchemaDefinition, BaseQueryData, Sort } from './mongo_base'
import { MESSAGES } from '../middlewares/i18n'
import { config } from '../configs'

// My Custom Queries
export type SampleQueryData = BaseQueryData & {
  name: string | { $regex: string; $options: string }
}

// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface Sample extends BaseDocument {
  name: string
  age: number
}

// -----------------------------------------------------------------------------------
// --------------------- Write Your Custom Methods in Model Class --------------------
// -----------------------------------------------------------------------------------
class MySampleModel extends BaseModel<Sample> {
  async greetings(sampleId: string): Promise<string> {
    const sample: Sample | null = await this.model.findById<Sample>(sampleId)
    logger.debug('sample: ', sample)
    if (!sample) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return 'Hi ' + sample.name + '!!'
  }

  async findByAge(age: number): Promise<Sample> {
    const sample: Sample | null = await this.model.findOne({ age })
    if (!sample) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return sample
  }

  async list(queryData: SampleQueryData): Promise<{ total: number; list: Sample[] }> {
    const { page, size, sortType, ...query } = queryData
    const limit: number = size > config.maxPageSizeLimit ? config.maxPageSizeLimit : size
    const skip: number = (page - 1) * limit
    const sortBy: Sort = sortType && sortType !== config.sortTypes.date ? { [config.sortTypes[sortType]]: 1 } : { createdAt: -1 }

    if (query.name) query.name = { $regex: query.name as string, $options: 'i' }

    query.deletedAt = 0

    const total: number = await this.model.countDocuments(query)
    const list: Sample[] = await this.model.find<Sample>(query).limit(limit).skip(skip).sort(sortBy)
    return { total, list }
  }
}

// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  name: { type: mongoose.Schema.Types.String, required: true, unique: true },
  age: { type: mongoose.Schema.Types.Number, default: 18 }
}

export const Model = new MySampleModel(definition, 'my_samples')
