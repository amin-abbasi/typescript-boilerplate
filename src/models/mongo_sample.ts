import { Schema, model } from 'mongoose'
import { BaseModel, IBase, IBaseUpdate, SchemaDefinition } from './mongo_base'

// -----------------------------------------------------------------------------------
// -------------------- Declare Your Custom Methods in Base Model --------------------
// -----------------------------------------------------------------------------------
declare module './mongo_base' {
  interface BaseModel {
    // Add new Method to class
    // getName: () => string
  }
}
// BaseModel.prototype.getName = function() {
//   return 'Hi ' + this.model.name + '!!'
// }


// -----------------------------------------------------------------------------------
// ------------------------------ Your Sample Interface ------------------------------
// -----------------------------------------------------------------------------------
export interface ISample extends IBase {
  name : string
  age  : number
}

export interface ISampleUpdate extends IBaseUpdate {
  name? : ISample['name']
  age?  : ISample['age']
}


// -----------------------------------------------------------------------------------
// ---------------------- Your MongoDB Schema Model Definition -----------------------
// -----------------------------------------------------------------------------------
const definition: SchemaDefinition = {
  name: { type: Schema.Types.String, required: true, unique: true },
  age:  { type: Schema.Types.Number, default: 18 },
}

const baseModel: BaseModel = new BaseModel(definition)
baseModel.model = model<ISample>('user', baseModel.schema)

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