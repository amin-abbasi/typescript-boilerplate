"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const objectId = celebrate_1.Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const exportResult = {
    // Create new Sample
    create: celebrate_1.celebrate({
        // body: {
        //   name: Joi.string().required().description('User Name'),
        //   userId: objectId.required().description('User ID')
        // },
        query: {}
    }),
    // List All Samples
    list: celebrate_1.celebrate({
        query: {}
    }),
    // Show Sample Details
    details: celebrate_1.celebrate({
        params: {
            sampleId: objectId.required().description('Sample ID')
        },
        query: {}
    }),
    // Update Sample
    update: celebrate_1.celebrate({
        // body: {
        //   name: Joi.string().description('User Name'),
        //   userId: objectId.required().description('User ID')
        // },
        params: {
            sampleId: objectId.required().description('Sample ID')
        },
        query: {}
    }),
    // Delete Sample (Soft Delete)
    delete: celebrate_1.celebrate({
        params: {
            sampleId: objectId.required().description('Sample ID')
        },
        query: {}
    })
};
exports.default = exportResult;
