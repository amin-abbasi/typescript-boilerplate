import app from './app'
const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = app.get('config').env

// Listen on the designated port found in the .env [use 'server' instead of 'app' if you have socket.io]
app.listen(SERVER_PORT || 4000, (err: any) => {
  if (err) throw new Error(`SERVER ERROR: ${err}`)

  // output the status of the app in the terminal
  const url = `${SERVER_PROTOCOL || 'http'}://${SERVER_HOST || 'localhost'}:${SERVER_PORT || 4000}`
  console.info(`API is now running on ${url} in ${NODE_ENV || 'development'} mode`)
})

export default app