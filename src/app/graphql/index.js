const _ = require('lodash')
const fs = require('fs')
const { gql } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { GraphQLJSON } = require('graphql-type-json')

// const Post = require('src/graphql/post')
// const Comment = require('src/graphql/comment')

/*
 * Notes:
 * https://graphql.org/
 * https://github.com/apollographql/graphql-tools/issues/750
 * https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
 * https://www.apollographql.com/docs/graphql-tools/generate-schema.html
 * https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49
 */

class GraphQL {
  constructor() {

    this._typeDefs = [this.getDefaultTypeDefs()]
    this._resolvers = {
      JSON: GraphQLJSON
    }

  }

  build(appPath) {
    fs.readdirSync(`${appPath}/gql/`).forEach(file => {
      const { typeDef, resolvers } = require(`${appPath}/gql/${file}`)
      if (typeDef) {
        this._typeDefs.push(typeDef)
      }
      if (resolvers) {
        this._resolvers = _.merge(this._resolvers, resolvers)
      }
    })
  }

  getSchema() {
    return makeExecutableSchema({
      typeDefs: this._typeDefs,
      resolvers: this._resolvers
    })
  }

  getDefaultTypeDefs() {
    return gql`
      scalar JSON

      type Query {
        _empty: String
      }

      type Mutation {
        _empty: String
      }

    `
  }
}

module.exports = new GraphQL()