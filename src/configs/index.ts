import dotenv from 'dotenv'
import { ConfigModel, EnvironmentModel } from './types'
dotenv.config()

const env = JSON.parse(JSON.stringify(process.env)) as EnvironmentModel

// All Configs that needed to be centralized
export const config: ConfigModel = {
  // JWT Configuration
  jwt: {
    key: env.JWT_SECRET || 'your_random_jwt_secret_key',
    expiration: 20 * 60 * 1000, // milliseconds (e.g.: 60, "2 days", "10h", "7d")
    algorithm: 'HS384', // (default: HS256)
    cache_prefix: 'token:',
    allow_renew: true,
    renew_threshold: 2 * 60 * 1000
  },

  // dotenv App Environment Variables
  env,

  // Base URL
  // baseURL: 'https://www.your_domain.com',
  baseURL: `${env.SERVER_PROTOCOL}://${env.SERVER_HOST}:${env.SERVER_PORT}`,

  // Max Page Size Limit in listing
  maxPageSizeLimit: 20,

  // Regex
  regex: {
    objectId: /^[0-9a-fA-F]{24}$/
  },

  // Role Types
  roleTypes: {
    normal: 'normal',
    admin: 'admin',
    agent: 'agent',
    other: 'other'
  },

  // Sort Types
  sortTypes: {
    date: 'createdAt',
    name: 'name'
  },

  // MS Configs --- Should be declared in interface before usage
  MS: {
    some_microservice: {
      // url: 'https://localhost:3000/api',
      url: 'https://example.com/api',
      paths: {
        doSomething: '/v1/samples'
      }
    }
  }
}
