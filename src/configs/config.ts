import dotenv from 'dotenv'
import { IConfigModel } from './interface'
dotenv.config()

// All Configs that needed to be centralized
const config: IConfigModel = {

  // JWT Configuration
  jwt: {
    key: 'your_jwt_secret_key',
    expiration: 20 * 60 * 1000,       // milliseconds (e.g.: 60, "2 days", "10h", "7d")
    algorithm: 'HS384',               // (default: HS256)
    cache_prefix: 'token:',
    allow_renew: true,
    renew_threshold: 2 * 60 * 1000
  },

  // dotenv App Environment Variables
  env: JSON.parse(JSON.stringify(process.env)),

  // You can add an Interface for your config
  somethingNew: {
    name: 'your_value',
    apiKey: ''
  },

  // Sample Types
  sampleTypes: {
    type1: 'type1',
    type2: 'type2',
    type3: 'type3',
    other: 'other',
  }

  // MS Configs --- Should be declared in interface before usage
  // MS: {
  //   some_microservice: {
  //     host: 'localhost',
  //     port: 3000,
  //     paths: {
  //       doSomething: '/api/v1/samples',
  //     }
  //   }
  // }

}

export default config