import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'
import { apis as userApis } from './models/user'
import { EApiType } from './core/metadata'

const apis = [
  ...userApis,
]

const getFieldsByApiType = (type: EApiType) => _.chain(apis)
  .filter({ type })
  .map(generator => generator.generate())
  .reduce(_.merge)
  .value()

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: getFieldsByApiType(EApiType.QUERY)
})

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: getFieldsByApiType(EApiType.MUTATION)
})

const schema = new graphql.GraphQLSchema({ query, mutation })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`))
