import socket from 'socket.io'
import app    from '../app'
// import {  } from './methods'

const io: socket.Server = app.get('io')

io.sockets.on('connection', (socket: socket.Socket) => {
  console.log(' >>>>> Socket.io Is Connected!')

  // Wait for connection
  socket.on('someEvent', (data: { [key: string]: string }) => {
    // ... do something
    io.emit('test', data)
  })


})

export default io
