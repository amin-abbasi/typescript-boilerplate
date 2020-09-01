import { Algorithm } from 'jsonwebtoken'

export interface IJwtModel {
  readonly key             : string
  readonly expiration      : number | string
  readonly algorithm       : Algorithm
  readonly cache_prefix    : string
  readonly allow_renew     : boolean
  readonly renew_threshold : number
}

export interface IEnvironmentModel {
  readonly NODE_ENV : string
  readonly APP_ENV  : string
  readonly DB_HOST  : string
  readonly DB_USER? : string
  readonly DB_PASS? : string
  readonly DB_PORT  : number
  readonly DB_NAME  : string
  readonly SERVER_PROTOCOL: string
  readonly SERVER_HOST : string
  readonly SERVER_PORT : number
  readonly LOGGER_HOST : string
  readonly LOGGER_PORT : number
  readonly REDIS_HOST? : string
  readonly REDIS_PORT? : number
  readonly REDIS_PASS? : string
  readonly ADMIN_USER? : string
  readonly ADMIN_PASS? : string
  readonly JWT_SECRET? : string
}

interface IMS_Configs {
  [key: string]: {
    url: string
    paths: {
      [key: string]: string
    }
  }
}

export interface IType {
  [key: string]: string
}

export interface IType {
  [key: string]: RegExp
}

export interface IConfigModel {
  readonly jwt       : IJwtModel
  readonly env       : IEnvironmentModel
  readonly baseURL   : string
  readonly roleTypes : IType
  readonly MS        : IMS_Configs
  readonly regex     : IRegex
}
