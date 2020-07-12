// Your Express Server Configuration Here
import fs    from 'fs'
import path  from 'path'
import http  from 'http'
import https from 'https'
import app   from './app'

const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = app.get('config').env
let expressServer

if(SERVER_PROTOCOL === 'http') expressServer = http.createServer(app)
else {
  const keyPath = path.join(__dirname, '../sslCert/server.key')
  const crtPath = path.join(__dirname, '../sslCert/server.crt')

  const checkPath = fs.existsSync(keyPath) && fs.existsSync(crtPath)
  if(!checkPath) {
    console.error('No SSL Certificate found to run HTTPS Server!!')
    process.exit(1)
  }

  const privateKey: string  = fs.readFileSync(keyPath, 'utf8')
  const certificate: string = fs.readFileSync(crtPath, 'utf8')
  const credentials = { key: privateKey, cert: certificate }

  expressServer = https.createServer(credentials, app)
}

expressServer.listen(SERVER_PORT, () => {
  const url = `${SERVER_PROTOCOL || 'https'}://${SERVER_HOST || 'localhost'}:${SERVER_PORT || 4000}`
  console.info(`API is now running on ${url} in ${NODE_ENV || 'development'} mode`)
})

export default expressServer