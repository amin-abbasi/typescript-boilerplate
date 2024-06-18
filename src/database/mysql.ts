import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { config } from '../configs'
import { logger } from '../services'

// Database Connection Options
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_CONNECTION } = config.env
let options: ConnectionOptions = {
  name: DB_CONNECTION || 'default',
  // name: DB_NAME,
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  logging: true,
  // synchronize: true
  entities: ['./src/models/*.ts', './dist/models/*.js']
}
if (DB_USER && DB_PASS) options = { ...options, username: DB_USER, password: DB_PASS }

// create typeorm connection
async function connectMySQL(): Promise<Connection> {
  try {
    const dbConnection: Connection = await createConnection(options)
    logger.debug('DB Connection: ', dbConnection)
    return dbConnection
  } catch (error) {
    logger.error('MySQL Connection Error: ', error)
    throw Error(`MySQL Connection Error: ${error}`)
  }
}

export default connectMySQL
