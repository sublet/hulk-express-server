const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const Promise = require('bluebird')
const logger = require('../app/logger')
const configLib = require('../app/config')
const { MongoClient } = require('mongodb')
const autopopulate = require('mongoose-autopopulate')
const { mongo } = configLib(process.env.APP_FOLDER_PATH)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

/*
 * Notes:
 * https://hackernoon.com/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47
 * https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
*/

class Mongo {
  constructor() {
    this.isConnected = false

    mongoose.Promise = Promise

    if (mongo && mongo.uri) this.connectToDatabase()
  }

  async connectToDatabase() {
    if (!this.isConnected) {
      if (process.env.NODE_ENV !== 'production') logger.info('## using new database connection')
      if (process.env.NODE_ENV === 'local' && mongo.ssl) {
        logger.warn('####################################')
        logger.warn('####################################')
        logger.warn('##### WARNING: SSL is currently on!')
        logger.warn('####################################')
        logger.warn('####################################')
      }

      console.log(mongo)
      
      const db = await mongoose.connect(mongo.uri, this._getOptions())
      this.isConnected = db.connections[0].readyState
    } else {
      logger.info('=> using existing database connection')
      return Promise.resolve()
    }
  }

  _getOptions() {
    return {
      dbName: mongo.db,
      ssl: mongo.ssl,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }

  buildModel(name, structure) {
    let schema = new mongoose.Schema(structure, { autoIndex: process.env.DISABLE_AUTO_INDEX })

    schema.plugin(autopopulate)

    schema.method('toClient', function() {
      let obj = this.toObject()
      obj.id = obj._id
      delete obj._id
      delete obj.deleted
      delete obj.__v
      return obj
    })

    schema.set('toObject', { getters: true })
    schema.set('toJSON', { getters: true })

    return mongoose.model(name, schema)
  }

  getId() {
    return {
      type: String,
      default: uuidv4,
      required: true
    }
  }

  async quickConnect() {
    let client = new MongoClient(mongo.uri, { promiseLibrary: Promise, useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    return { client, db: client.db(mongo.db) }
  }
}

module.exports = new Mongo()