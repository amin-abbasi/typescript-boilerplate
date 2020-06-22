import dotenv from 'dotenv'
import { ConfigModel } from './interface'
dotenv.config()

// All Configs that needed to be centralized
const config: ConfigModel = {

  // JWT Configuration
  jwt: {
    key: 'your_jwt_secret_key',
    expiration: 3600,           // seconds (e.g.: 60, "2 days", "10h", "7d")
    algorithm: 'HS384',         // (default: HS256)
    cache_prefix: 'token:',
    allow_renew: true,
    renew_threshold: 60
  },

  env: JSON.parse(JSON.stringify(process.env)),

  mailGun: {
    host: '',
    apiKey: ''
  }

  // MS Configs --- Should be declared in interface before usage
  // MS: {
  //   some_microservice: {
  //     host: 'localhost',
  //     port: 3000,
  //     paths: {
  //       create: '/v1/sample',
  //     }
  //   }
  // }

}

export default config