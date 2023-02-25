import dotenv from 'dotenv'
import { EnvironmentModel, JwtConfig, RegexType, StringType } from './types'
dotenv.config()

export const env = JSON.parse(JSON.stringify(process.env)) as EnvironmentModel

// JWT Configuration
export const JWT: JwtConfig = {
  key             : env.JWT_SECRET || 'your_random_jwt_secret_key',
  expiration      : 20 * 60 * 1000,   // milliseconds (e.g.: 60, "2 days", "10h", "7d")
  algorithm       : 'HS384',          // (default: HS256)
  cache_prefix    : 'token:',
  allow_renew     : true,
  renew_threshold : 2 * 60 * 1000
}

// Base URL
// baseURL: 'https://www.your_domain.com',
export const BASE_URL: string = `${env.SERVER_PROTOCOL}://${env.SERVER_HOST}:${env.SERVER_PORT}`

// Max Page Size Limit in listing
export const MAX_PAGE_SIZE: number = 20

// Regex
export const REGEX: RegexType = {
  objectId: /^[0-9a-fA-F]{24}$/,
}

// Role Types
export const ROLES: StringType = {
  normal: 'normal',
  admin: 'admin',
  agent: 'agent',
  other: 'other',
}

// Sort Types
export const SORT: StringType = {
  date: 'createdAt',
  name: 'name',
}

// MS Configs --- Should be declared in interface before usage
// export const MS = {
//   some_microservice: {
//     url: 'https://example.com/api',
//     paths: {
//       doSomething: '/v1/samples',
//     }
//   }
// }
