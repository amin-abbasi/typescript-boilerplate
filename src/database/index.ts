import mongoConnect from './mongo'
import mysqlConnect from './mysql'
import { config } from '../configs'

/**
 * Connect to MongoDB or MySQL database
 */
async function dbConnect(): Promise<void> {
  if (config.env.DB_TYPE === 'mongodb') await mongoConnect()
  else await mysqlConnect()
}

export default dbConnect
