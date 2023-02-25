import mongoConnect from './mongo'
import mysqlConnect from './mysql'
import { env } from '../configs'

/**
 * Connect to MongoDB or MySQL database
 */
async function dbConnect(): Promise<void> {
  if(env.DB_TYPE === 'mongodb') await mongoConnect()
  else await mysqlConnect()
}

export default dbConnect
