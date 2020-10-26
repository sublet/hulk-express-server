const express = require('express');
const http = require('http');
const Promise = require('bluebird');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressLogger = require('../logger/express');
const errorHandler = require('./errorHandler');
const notFoundHandler = require('./notFoundHandler');
const responseTimeHandler = require('./responseTimeHandler');

class Server {
  constructor() {
    this._app = express();
    this._wrapAsync = null
  }

  setWrapAsync(fn) {
    this._wrapAsync = fn
  }

  setup() {
    if (!this._wrapAsync) throw new Error('wrapAsync method is invalid.')

    // Setup Body General stuff
    const bodyParseJson = bodyParser.json({
      type: '*/*',
      limit: '50mb',
      verify: (req, res, buf) => {
        req.rawBody = buf
      }
    });
    const bodyParseEncoded = bodyParser.urlencoded({ extended: false });
    this._app.use(cors());
    this._app.use(expressLogger()); // Log Request
    this._app.use(bodyParseJson);
    this._app.use(bodyParseEncoded);
    this._app.use(responseTimeHandler());

    // Setup Router
    this._router = express.Router();
    this._app.use('/', this._router);

    // Setup Error Reporting.
    process.nextTick(() => {
      this._app.use(notFoundHandler());
      this._app.use(errorHandler());
    });

    // Start Server
    this._server = http.createServer(this._app);
  }

  create() {
    this._server = http.createServer(this._app);
  }

  get app() {
    return this._app;
  }

  start(port = 3000, bind = null) {
    if (!port) throw new Error('Port not set.');

    return Promise.fromCallback(cb => this._server.listen(port, bind, cb));
  }

  close() {
    this._server.close();
  }

  /**
   * @method get
   */
  get() {
    return this._router.get(...arguments);
  }

  /**
   * @method get
   */
  post() {
    return this._router.post(...arguments);
  }

  /**
   * @method put
   */
  put() {
    return this._router.put(...arguments);
  }

  /**
   * @method delete
   */
  delete() {
    return this._router.delete(...arguments);
  }

  /**
   * @method wrapAsync
   */
  wrapAsync(fn, validate = false) {
    return this._wrapAsync(fn, validate);
  }
}

module.exports = Server;
