const api = require('./api')
const config = require('./config')
const logger = require('./logger')
const server = require('./server')

class Server {

  get api() {
    return api
  }

  get config() {
    return config
  }

  get logger() {
    return logger
  }

  get server() {
    return server
  }

}

module.exports = new Server()