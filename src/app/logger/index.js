const winston = require('winston')
const transports = require('./transports')
const config = require('./config')
const MESSAGE = Symbol.for('message')

const jsonFormatter = (logEntry) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

const logger = new winston.createLogger({
  levels: config.output.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
    // winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: transports
})

module.exports = logger