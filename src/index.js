const { 
  api: _api, 
  config: _config,
  logger: _logger,
  server: _server,
} = require('./app')

class Server {

  constructor(config) {
    this._config = config
    this._services = null
    this._buildConfig = _config(this._config.appFolder)
    _server.setWrapAsync(this._config.wrapAsync)

    this.dataLayer = (this._config.dataLayer) ? this._config.dataLayer : null
    
    process.env.APP_FOLDER_PATH = this._config.appFolder
  }

  get api() {
    return _api
  }

  get config() {
    return this._buildConfig
  }

  get logger() {
    return _logger
  }

  get router() {
    return _server
  }

  get db() {
    return this.dataLayer
  }

  get services() {
    if (this.dataLayer) {
      return this.dataLayer.build()
    }
    return null
  }

  setupAndCreate() {
    this.setup()
    this.create()
  }

  setup() {
    _server.setup(this._config)
  }

  create() {
    _server.create()
  }

  getServer() {
    this._build()
    return _server.app
  }

  start() {
    var port = this._normalizePort(this._config.port || '3000');
    var bind = this._config.bind

    this._build()

    _api.start(port, bind)
      .then(() => console.log(`Node Server Started on port ${port}!`))
  }

  // Private

  _build() {
    _api.build(this._config.appFolder)
  }

  _normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
  }
}

module.exports = config => new Server(config)