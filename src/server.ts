// Your Express Server Configuration Here
import 'reflect-metadata'
import fs from 'fs'
import path from 'path'
import gach from 'gach'
import http from 'http'
import https from 'https'

import app from './app'
import dbConnect from './database'
import { config } from './configs'
import { logger } from './services'

const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config.env

// TODO: Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// ---------------- Create Server Instance ----------------
let server: http.Server | https.Server
if (!SERVER_PROTOCOL || SERVER_PROTOCOL === 'http') server = http.createServer(app)
else {
  const keyPath: string = path.join(__dirname, '../sslCert/server.key')
  const crtPath: string = path.join(__dirname, '../sslCert/server.crt')
  const checkPath: boolean = fs.existsSync(keyPath) && fs.existsSync(crtPath)
  if (!checkPath) {
    logger.error('No SSL Certificate found to run HTTPS Server!!')
    process.exit(1)
  }
  const key: string = fs.readFileSync(keyPath, 'utf8')
  const cert: string = fs.readFileSync(crtPath, 'utf8')
  const credentials: https.ServerOptions = { key, cert }
  server = https.createServer(credentials, app)
}

// ---------------- Add Socket.io ----------------
// import socket from 'socket.io'
// const io: socket.Server = new socket.Server(server)
// app.set('io', io)

// ---------------- Start Server ----------------
async function startServer(server: http.Server | https.Server): Promise<void> {
  server.listen(SERVER_PORT || 4000, () => {
    const url = `${SERVER_PROTOCOL || 'http'}://${SERVER_HOST || 'localhost'}:${SERVER_PORT || 4000}`
    logger.info(`Server is now running on ${gach(url).color('lightBlue').bold().text} in ${NODE_ENV || 'development'} mode`)
  })
}

;(async () => {
  try {
    await dbConnect()
    await startServer(server)
  } catch (error) {
    throw Error(`>>>>> Server Connection Error: ${error}`)
  }
})()
