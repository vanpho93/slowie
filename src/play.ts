import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'
import { apis } from './models/user'

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    [`get${apis.collection}`]: apis.get,
    [`get${apis.collection}s`]: apis.list,
  }
})

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    [`create${apis.collection}`]: apis.create,
    [`update${apis.collection}`]: apis.update,
    [`remove${apis.collection}`]: apis.remove,
  }
})

const schema = new graphql.GraphQLSchema({ query, mutation })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`))
