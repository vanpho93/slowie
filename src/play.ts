import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'

const dishes = [
  { id: 'dish_1', name: 'Com tam' },
  { id: 'dish_2', name: 'Pho' },
]

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
      resolve: () => dishes,
    },
    dish: {
      type: dish,
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: (_, { id }) => dishes.find(dish => dish.id === id),
    }
  }
})

const schema = new graphql.GraphQLSchema({ query })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})
