import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'
import { dishQuery, dishes, createDish, removeDish, updateDish } from './models/dish'
import { createOption, removeOption, updateOption } from './models/option'

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    dishes,
    dish: dishQuery,
  }
})

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createDish,
    removeDish,
    updateDish,
    createOption,
    removeOption,
    updateOption,
  }
})

const schema = new graphql.GraphQLSchema({ query, mutation })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`))
