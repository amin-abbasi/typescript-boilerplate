// Your Express Server Configuration Here
import 'reflect-metadata'
import { Application } from 'express'
import fs     from 'fs'
import path   from 'path'
import http   from 'http'
import https  from 'https'
import app    from './app'
import config from './configs/config'

const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config.env

// ------ Require Database
import dbConnect from './services/database'

// TODO: Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function setExpressServer(app: Application): http.Server | https.Server {
  let expressServer: http.Server | https.Server
  if (SERVER_PROTOCOL === 'http') expressServer = http.createServer(app)
  else {
    const keyPath: string = path.join(__dirname, '../sslCert/server.key')
    const crtPath: string = path.join(__dirname, '../sslCert/server.crt')
    const checkPath: boolean = fs.existsSync(keyPath) && fs.existsSync(crtPath)
    if (!checkPath) {
      console.error('No SSL Certificate found to run HTTPS Server!!')
      process.exit(1)
    }
    const privateKey: string = fs.readFileSync(keyPath, 'utf8')
    const certificate: string = fs.readFileSync(crtPath, 'utf8')
    const credentials: https.ServerOptions = {
      key: privateKey,
      cert: certificate
    }
    expressServer = https.createServer(credentials, app)
  }
  return expressServer
}


// ---------------- Add Socket.io ----------------
// import socket from 'socket.io'
// const io: socket.Server = socket(expressServer)
// app.set('io', io)

// ---------------- Start Server ----------------
const startServer = async (expressServer: http.Server | https.Server) => {
  expressServer.listen(SERVER_PORT, () => {
    const url = `${SERVER_PROTOCOL || 'http'}://${SERVER_HOST || 'localhost'}:${SERVER_PORT || 4000}`
    console.log(`API is now running on ${url} in ${NODE_ENV || 'development'} mode`)
  })
}

(async () => {
  try {
    await dbConnect()

    const expressServer: http.Server | https.Server = setExpressServer(app)
    await startServer(expressServer)
  } catch (error) {
    throw Error(`>>>>> Server Connection Error: ${error}`)
  }
})()
