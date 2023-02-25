import { DataSource, DataSourceOptions } from 'typeorm'
import { env } from '../configs'

// Database Connection Options
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_CONNECTION } = env
let options: DataSourceOptions = {
  name: DB_CONNECTION || 'default',
  // name: DB_NAME,
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  logging: true,
  // synchronize: true
  entities: ['./src/models/*.ts', './dist/models/*.js'],
}
if(DB_USER && DB_PASS) options = { ...options, username: DB_USER, password: DB_PASS }

// create typeORM connection
async function connectMySQL(): Promise<DataSource> {
  try {
    const dbConnection: DataSource = new DataSource(options)
    console.log('DB Connection: ', dbConnection)
    return await dbConnection.initialize()
  } catch (error) {
    console.error('MySQL Connection Error: ', error)
    throw Error(`MySQL Connection Error: ${error}`)
  }
}

export default connectMySQL
