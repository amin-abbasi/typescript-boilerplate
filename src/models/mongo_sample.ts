import mongoose from 'mongoose'
import { IModel, IModelUpdate, Model, SchemaDefinition } from './mongo_base'
// import Boom from '@hapi/boom'

// -----------------------------------------------------------------------------------
// -------------------- Declare Your Custom Methods in Base Model --------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface Model {
    // Add new methods to class ...
    // getName: () => string
    // findByAge: (age: number) => Promise<ISample>
  }
}

// Model.prototype.getName = function(): string {
//   return 'Hi ' + this.model.name + '!!'
// }

// Model.prototype.findByAge = async function(age: number): Promise<ISample> {
//   const sample: ISample | null = await this.model.findOne({ age })
//   if(!sample) throw Boom.notFound('Model not found.')
//   return sample
// }


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