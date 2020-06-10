import dotenv from 'dotenv'
import { Algorithm } from 'jsonwebtoken'
dotenv.config()

interface ConfigModel {
  jwt: {
    key: string
    expiration: number
    algorithm: Algorithm
    cache_prefix: string
    allow_renew: boolean
    renew_threshold: number
  }
  env: any
}

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

  env: JSON.parse(JSON.stringify(process.env))

  // MS Configs
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