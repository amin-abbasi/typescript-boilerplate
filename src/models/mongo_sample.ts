import mongoose from 'mongoose'
import { IModel, IModelUpdate, Model, SchemaDefinition } from './mongo_base'
import Boom from '@hapi/boom'
import { MESSAGES } from '../services/i18n/types'

// -----------------------------------------------------------------------------------
// ------------------------ Write Your Custom Methods in Model -----------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface Model {
    // Add new methods to class ...
    greetings: (sampleId: string) => Promise<string>
    findByAge: (age: number) => Promise<ISample>
  }
}

/** Get Model Mane */
Model.prototype.greetings = async function(sampleId: string): Promise<string> {
  const sample: ISample | null = await this.model.findById(sampleId)
  console.log(sample)
  if(!sample) throw Boom.notFound(MESSAGES.MODEL_NOT_FOUND)
  return 'Hi ' + sample.name + '!!'
}

/** Find Model By Age */
Model.prototype.findByAge = async function(age: number): Promise<ISample> {
  const sample: ISample | null = await this.model.findOne({ age })
  if(!sample) throw Boom.notFound(MESSAGES.MODEL_NOT_FOUND)
  return sample
}


// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface ISample extends IModel {
  name : string
  age  : number
}

export interface ISampleUpdate extends IModelUpdate {
  name? : ISample['name']
  age?  : ISample['age']
}


// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  name: { type: mongoose.Schema.Types.String, required: true, unique: true },
  age:  { type: mongoose.Schema.Types.Number, default: 18 },
}

const baseModel: Model = new Model(definition)
baseModel.model = mongoose.model<ISample>('user', baseModel.schema)

export default baseModel


// -----------------------------------------------------------------------------------
// ---------------------------- Swagger Models Definition ----------------------------
// -----------------------------------------------------------------------------------

/**
 * @openapi
 * components:
 *   schemas:
 *     Sample:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *           description: User age
 *       example:
 *         name: 'Amin'
 *         age: 34
 */
