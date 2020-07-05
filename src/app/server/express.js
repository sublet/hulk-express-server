const express = require('express');
const http = require('http');
const Promise = require('bluebird');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const graphql = require('../graphql')
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

  enableGraphql(enable = false) {
    this._enableGraphql = enable
  }

  setup() {
    if (!this._wrapAsync) throw new Error('wrapAsync method is invalid.')

    const bodyParseJson = bodyParser.json({
      type: '*/*',
      limit: '50mb',
    });
    const bodyParseEncoded = bodyParser.urlencoded({ extended: false });

    this._app.use(cors());
    if (this._enableGraphql) this.setupGraphQL();
    this._app.use(expressLogger()); // Log Request
    this._app.use(bodyParseJson);
    this._app.use(bodyParseEncoded);

    this._app.use(responseTimeHandler());

    this._router = express.Router();
    this._app.use('/', this._router);

    process.nextTick(() => {
      this._app.use(notFoundHandler());
      this._app.use(errorHandler());
    });

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

  setupGraphQL() {
    const schema = graphql.getSchema()
    this._app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({schema, context: { headers: request.headers } })))
    this._app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }))
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
