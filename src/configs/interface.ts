import { Algorithm } from 'jsonwebtoken'

interface JwtModel {
  key: string
  expiration: number
  algorithm: Algorithm
  cache_prefix: string
  allow_renew: boolean
  renew_threshold: number
}

interface EnvironmentModel {
  NODE_ENV: string
  APP_ENV: string
  DB_HOST: string
  DB_USER?: string
  DB_PASS?: string
  DB_PORT: number
  DB_NAME: string
  SERVER_PROTOCOL: string
  SERVER_HOST: string
  SERVER_PORT: number
  LOGGER_HOST: string
  LOGGER_PORT: number
  REDIS_HOST: string
  REDIS_PORT: number
}

type SomethingNewModel = {
  name: string
  age?: number
  apiKey?: never
  username: string
  password: string
} | {
  name: string
  age?: number
  apiKey: string
  username?: never
  password?: never
}

export interface ConfigModel {
  jwt: JwtModel
  env: EnvironmentModel
  somethingNew: SomethingNewModel
}