const logger = require('../logger')

const expressLogger = () => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') return next()
    if (process.env.NODE_ENV !== 'test') {
      if (['/health','/healthCheck'].indexOf(req.url) < 0) logger.info(`${req.method} - ${req.url}`)
    }
    return next()
  }
}

module.exports = expressLogger