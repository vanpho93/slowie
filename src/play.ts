import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'

const dish = new graphql.GraphQLObjectType({
  name: 'Dish',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    dishes: {
      type: graphql.GraphQLList(dish),
      resolve: () => [{ id: 'dish_1', name: 'Com tam' }, { id: 'dish_2', name: 'Pho' }]
    }
  }
})

const schema = new graphql.GraphQLSchema({ query })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})
