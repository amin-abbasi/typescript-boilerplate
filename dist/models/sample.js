"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const boom_1 = __importDefault(require("@hapi/boom"));
const Schema = mongoose_1.default.Schema;
// Add your own attributes in schema
const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    any: Schema.Types.Mixed,
    // Advanced Property type schema
    // location: {
    //   type: {
    //     _id: false,
    //     address: { type: Schema.Types.String },
    //     coordinate: {
    //       type: {
    //         _id: false,
    //         lat: Schema.Types.Number,
    //         lon: Schema.Types.Number
    //       }
    //     }
    //   },
    //   required: true
    // },
    createdAt: { type: Schema.Types.Number },
    updatedAt: { type: Schema.Types.Number },
    deletedAt: { type: Schema.Types.Number, default: null },
}, {
    strict: false,
});
// Apply the Unique Property Validator plugin to schema.
// import uniqueV from 'mongoose-unique-validator'
// schema.plugin(uniqueV, { message: 'Error, expected "{PATH}" to be unique.' })
// ------------------------------------- Set Hooks (like: 'pre') for Schema -------------------------------------
// schema.pre('save', function(next) {
//   ... Code Here ...
//   next()
// })
// Flatten model to update (patch) partial data
// schema.pre('findOneAndUpdate', function() {
//   this._update = flat(this._update)
// })
// Choose your own model name
const model = ((_a = mongoose_1.default.models) === null || _a === void 0 ? void 0 : _a.ModelName) ? mongoose_1.default.models.ModelName : mongoose_1.default.model('ModelName', schema);
class ModelName extends model {
    // Options i.e.: { checkKeys: false }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelName = new ModelName(Object.assign(Object.assign({}, data), { createdAt: new Date().getTime() }));
            return options ? modelName.save(options) : modelName.save();
        });
    }
    static details(modelNameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelName = yield ModelName.findById(modelNameId);
            if (!modelName || modelName._doc.deletedAt)
                throw boom_1.default.notFound('ModelName not found.');
            return modelName._doc;
        });
    }
    static list(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!query)
                query = {};
            query.deletedAt = null;
            const result = yield ModelName.find(query);
            return {
                total: result.length,
                list: result
            };
        });
    }
    static update(query, data) {
        const updatedData = Object.assign(Object.assign({}, data), { updatedAt: new Date().getTime() });
        return ModelName.findOneAndUpdate(query, updatedData, { new: true });
    }
    static updateById(modelNameId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelName = yield this.details(modelNameId);
            lodash_1.default.merge(modelName, data);
            modelName.updatedAt = new Date().getTime();
            return ModelName.findByIdAndUpdate(modelNameId, modelName, { new: true });
        });
    }
    static delete(modelNameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.details(modelNameId);
            return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: new Date().getTime() }, { new: true });
        });
    }
    static restore(modelNameId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.details(modelNameId);
            return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: null }, { new: true });
        });
    }
}
exports.default = ModelName;
// --------------- Swagger Models Definition ---------------
/**
 * @swagger
 *  components:
 *    schemas:
 *      Sample:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Amin
 *           email: amin@gmail.com
 */ 
