import mongoose from 'mongoose'
import Errors   from 'http-errors'
import { BaseDocument, BaseModel, SchemaDefinition } from './mongo_base'
import { MESSAGES } from '../middlewares/i18n/types'

// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface Sample extends BaseDocument {
  name : string
  age  : number
}

// -----------------------------------------------------------------------------------
// ------------------------ Write Your Custom Methods in Model -----------------------
// -----------------------------------------------------------------------------------

declare module './mongo_base' {
  interface BaseModel<T> {
    // Add new methods to class ...
    greetings: (sampleId: string) => Promise<string>
    findByAge: (age: number) => Promise<Sample>
  }
}

/** Find Model & Greet by Name */
BaseModel.prototype.greetings = async function(sampleId: string): Promise<string> {
  const sample: Sample | null = await this.model.findById(sampleId)
  console.log('sample: ', sample)
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return 'Hi ' + sample.name + '!!'
}

/** Find Model By Age */
BaseModel.prototype.findByAge = async function(age: number): Promise<Sample> {
  const sample: Sample | null = await this.model.findOne({ age })
  if(!sample) throw new Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return sample
}

// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  name: { type: mongoose.Schema.Types.String, required: true, unique: true },
  age:  { type: mongoose.Schema.Types.Number, default: 18 },
}

const baseModel = new BaseModel<Sample>(definition, 'user')

export default baseModel
