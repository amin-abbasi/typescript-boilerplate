import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from '../configs'
import { logger } from '../services'
import { Sample } from '../models/mysql_sample'

// Database Connection Options
const { DB_TYPE, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_CONNECTION } = config.env
let options: DataSourceOptions = {
  name: DB_CONNECTION || 'default',
  type: (DB_TYPE === 'postgres' ? 'postgres' : 'mysql') as any,
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  database: DB_NAME,
  logging: true,
  synchronize: true, // Only for dev
  entities: [Sample]
}
if (DB_USER && DB_PASS) options = { ...options, username: DB_USER, password: DB_PASS }

export const AppDataSource = new DataSource(options)

async function connectSQL(): Promise<DataSource> {
  try {
    const dbConnection = await AppDataSource.initialize()
    logger.info(`<<<< Connected to ${DB_TYPE === 'postgres' ? 'PostgreSQL' : 'MySQL'} >>>>`)
    return dbConnection
  } catch (error) {
    logger.error('SQL Connection Error: ', error)
    throw Error(`SQL Connection Error: ${error}`)
  }
}

export default connectSQL
