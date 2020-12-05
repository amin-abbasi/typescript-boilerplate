// -------------------------------------- Initialize redis + config --------------------------------------
import redis  from 'redis'
import config from '../configs/config'

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env
const options: redis.ClientOpts = {
  port: REDIS_PORT,         // replace with your port
  host: REDIS_HOST,         // replace with your hostname or IP address
  // password: REDIS_PASS,     // replace with your password
  // optional, if using SSL
  // use `fs.readFile[Sync]` or another method to bring these values in
  // tls       : {
  //   key  : stringValueOfKeyFile,
  //   cert : stringValueOfCertFile,
  //   ca   : [ stringValueOfCaCertFile ]
  // }
}
if(REDIS_PASS) options.password = REDIS_PASS
const client = redis.createClient(options)

client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`) })
client.on('error', err => { console.log(`Redis Error: ${err}`) })

export default client