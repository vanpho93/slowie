import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'

const options = [
  { id: 'option_1', name: 'Nuoc mam' },
  { id: 'option_2', name: 'Op la' },
  { id: 'option_3', name: 'Hop giay' },
]

const dishes = [
  { id: 'dish_1', name: 'Com tam', optionIds: ['option_1'] },
  { id: 'dish_2', name: 'Pho', optionIds: ['option_2', 'option_3'] },
]

const option = new graphql.GraphQLObjectType({
  name: 'Option',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

const dish = new graphql.GraphQLObjectType({
  name: 'Dish',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    optionIds: { type: graphql.GraphQLList(graphql.GraphQLString) },
    options: {
      type: graphql.GraphQLList(option),
      resolve: (parent) => options.filter(option => parent.optionIds.includes(option.id)),
    },
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
