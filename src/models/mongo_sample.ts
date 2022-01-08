import { Schema, model } from 'mongoose'
import { BaseModel, IBase, SchemaDefinition } from './mongo_base'

// Your Sample Interface
export interface ISample extends IBase {
  name: string
  age: number
}

// Your MongoDB Schema Model Definition
const definition: SchemaDefinition = {
  name: { type: Schema.Types.String, required: true, unique: true },
  age:  { type: Schema.Types.Number, default: 18 },
}

const baseModel: BaseModel = new BaseModel(definition)
baseModel.model = model<ISample>('user', baseModel.schema)

export default baseModel

// --------------- Swagger Models Definition ---------------

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