"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Open http://<app_host>:<app_port>/docs in your browser to view the documentation.
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = __importDefault(require("../configs/config"));
const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config_1.default.env;
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`;
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MS-Sample API',
        version: '1.0.0',
        description: 'A micro-service to work on actions.',
        license: { name: 'AAH', url: 'http://aminaeon.ir/licenses' },
        contact: { name: 'Amin Abbasi', email: 'amin4193@gmail.com' }
    },
    servers: [{ url: `${url}/v1` }],
    // basePath: '/v1',
    // schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
};
const options = {
    swaggerDefinition: swaggerDefinition,
    // Path files to be processes. for: {openapi: '3.0.0'}
    apis: [
        './src/routes/*.ts',
        './src/models/*.ts',
        './dist/routes/*.js',
        './dist/models/*.js',
    ],
};
const specs = swagger_jsdoc_1.default(options);
module.exports = specs;
