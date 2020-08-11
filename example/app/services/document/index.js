const Model = require('./model')
const Service = require('./service')

module.exports = new Service(new Model('Document'), 'documentService')