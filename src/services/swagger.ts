// Open http://<app_host>:<app_port>/docs in your browser to view the documentation.
import swaggerJSDoc from 'swagger-jsdoc'
import config from '../configs/config'

const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config.env
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MS-Sample API',
    version: '1.0.0',
    description: 'A micro-service to work on actions.',
    license: { name: 'AAH', url: 'http://aminaeon.ir/licenses' },
    contact: { name: 'Amin Abbasi', email: 'amin4193@gmail.com' }
  },
  servers: [ { url: `${url}/v1` } ],
  // basePath: '/v1',
  // schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  // host: url, // Host (optional)
  // securityDefinitions: {
  //   JWT: {
  //       type: 'apiKey',
  //       in: 'header',
  //       name: 'Authorization',
  //       description: "JWT Token for user's authorization",
  //   }
  // }
}

const options = {
  swaggerDefinition: swaggerDefinition,
  // Path files to be processes. for: {openapi: '3.0.0'}
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts',
    './dist/routes/*.js',
    './dist/models/*.js',
  ],
  // files: ['../routes/*.js', '../models/*.js'],  // Path files to be processes. for: {swagger: '2.0'}
  // basedir: __dirname, //app absolute path
  // onValidateError: (errors, req, res, next) => { // global handler for validation errors
  //   res.status(400).send(errors)
  // },
}

const specs = swaggerJSDoc(options)
module.exports = specs