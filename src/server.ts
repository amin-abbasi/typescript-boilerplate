// Your Express Server Configuration Here
import fs    from 'fs'
import path  from 'path'
import http  from 'http'
import https from 'https'
import app   from './app'

const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = app.get('config').env
let expressServer: http.Server | https.Server

if(SERVER_PROTOCOL === 'http') expressServer = http.createServer(app)
else {
  const keyPath: string = path.join(__dirname, '../sslCert/server.key')
  const crtPath: string = path.join(__dirname, '../sslCert/server.crt')

  const checkPath: boolean = fs.existsSync(keyPath) && fs.existsSync(crtPath)
  if(!checkPath) {
    console.error('No SSL Certificate found to run HTTPS Server!!')
    process.exit(1)
  }

  const privateKey: string  = fs.readFileSync(keyPath, 'utf8')
  const certificate: string = fs.readFileSync(crtPath, 'utf8')
  const credentials: https.ServerOptions = { key: privateKey, cert: certificate }

  expressServer = https.createServer(credentials, app)
}


// ---------------- Add Socket.io ----------------
import socket from 'socket.io'
const io: socket.Server = socket(expressServer)
app.set('io', io)


// ---------------- Start Server ----------------
expressServer.listen(SERVER_PORT, () => {
  const url = `${SERVER_PROTOCOL || 'http'}://${SERVER_HOST || 'localhost'}:${SERVER_PORT || 4000}`
  console.info(`API is now running on ${url} in ${NODE_ENV || 'development'} mode`)
})

export default expressServer