import mongoose from 'mongoose'
import config   from '../configs/config'

// Database URL
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = config.env
let dbURL: string = ''
if(DB_USER && DB_PASS) dbURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
else dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Import the mongoose module
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

mongoose.connect(dbURL, options)
mongoose.Promise = global.Promise // Get Mongoose to use the global promise library
const db: mongoose.Connection = mongoose.connection    // Get the default connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

export default db
