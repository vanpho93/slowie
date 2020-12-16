import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ApolloServer } from 'apollo-server'
import { Document } from 'mongoose'
import { mongoose } from './mongoose'

interface IDish {
  _id: string
  name: string
  optionIds: string[]
}

interface IOption {
  _id: string
  name: string
}

export const Dish = mongoose.model<IDish & Document>('Dish', new mongoose.Schema({
  _id: String,
  name: String,
  optionIds: [String],
}))

export const Option = mongoose.model<IOption & Document>('Option', new mongoose.Schema({
  _id: String,
  name: String,
}))

const option = new graphql.GraphQLObjectType({
  name: 'Option',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

const dish = new graphql.GraphQLObjectType({
  name: 'Dish',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    optionIds: { type: graphql.GraphQLList(graphql.GraphQLString) },
    options: {
      type: graphql.GraphQLList(option),
      resolve: (parent) => Option.find({ _id: { $in: parent.optionIds } }),
    },
  }
})

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    dishes: {
      type: graphql.GraphQLList(dish),
      resolve: () => Dish.find({}),
    },
    dish: {
      type: dish,
      args: {
        _id: { type: graphql.GraphQLString }
      },
      resolve: (_, { _id }) => Dish.findById(_id),
    }
  }
})

async function init() {
  const exists = !_.isNil(await Dish.findOne({}))
  if (exists) return
  await Option.insertMany([
    { _id: 'option_1', name: 'Nuoc mam' },
    { _id: 'option_2', name: 'Op la' },
    { _id: 'option_3', name: 'Hop giay' },
  ])
  await Dish.insertMany([
    { _id: 'dish_1', name: 'Com tam', optionIds: ['option_1'] },
    { _id: 'dish_2', name: 'Pho', optionIds: ['option_2', 'option_3'] },
  ])
}

const schema = new graphql.GraphQLSchema({ query })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  return init()
})
