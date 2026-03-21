import mongoConnect from './mongo'
import mysqlConnect from './mysql'
import { config } from '../configs'
import { container } from 'tsyringe'

import { MongoSampleRepository } from './repositories/mongo.sample.repository'
import { TypeORMSampleRepository } from './repositories/typeorm.sample.repository'

// Define Injection Tokens
export const Repositories = {
  SampleRepository: 'SampleRepository'
}

/**
 * Connect to Database and Register Repositories into DI Container
 */
async function dbConnect(): Promise<void> {
  const { DB_TYPE } = config.env

  if (DB_TYPE === 'mongodb') {
    await mongoConnect()
    // Register Mongo Repositories
    container.register(Repositories.SampleRepository, { useClass: MongoSampleRepository })
  } else if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
    await mysqlConnect()
    // Register TypeORM Repositories
    container.register(Repositories.SampleRepository, { useClass: TypeORMSampleRepository })
  } else {
    throw new Error(`Unsupported DB_TYPE: ${DB_TYPE}`)
  }
}

export default dbConnect
