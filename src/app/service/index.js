const _ = require('lodash')
const fs = require('fs')

/*
 * Notes:
 * https://graphql.org/
 * https://github.com/apollographql/graphql-tools/issues/750
 * https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
 * https://www.apollographql.com/docs/graphql-tools/generate-schema.html
 * https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49
 */

class Services {
  get Model() {
    return require('./model')
  }
  
  get Service() {
    return require('./service')
  }

  build(appPath) {
    fs.readdirSync(`${appPath}/services/`).forEach(file => {
      require(`${appPath}/services/${file}`)
    })
  }
}

module.exports = new Services()