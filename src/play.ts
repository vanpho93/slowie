import { customAlphabet } from 'nanoid'
import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ApolloServer, ValidationError } from 'apollo-server'
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

const nanoid = customAlphabet('1234567890abcdef', 16)

export const Dish = mongoose.model<IDish & Document>('Dish', new mongoose.Schema({
  _id: { type: String, default: nanoid },
  name: String,
  optionIds: [String],
}))

export const Option = mongoose.model<IOption & Document>('Option', new mongoose.Schema({
  _id: { type: String, default: nanoid },
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

const dishInput = new graphql.GraphQLInputObjectType({
  name: 'DishInput',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    optionIds: { type: graphql.GraphQLList(graphql.GraphQLString) },
  }
})

const optionInput = new graphql.GraphQLInputObjectType({
  name: 'OptionInput',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createDish: {
      type: dish,
      args: { input: { type: dishInput } },
      resolve: (__, { input: { name, optionIds } }) => Dish.create({ name, optionIds }),
    },
    updateDish: {
      type: dish,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }, input: { type: dishInput } },
      resolve: async (__, { _id, input: { name, optionIds } }) => {
        const updated = await Dish.findByIdAndUpdate(_id, { name, optionIds }, { new: true })
        if (_.isNil(updated)) throw new ValidationError('DISH_NOT_FOUND')
        return updated
      },
    },
    removeDish: {
      type: dish,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const removed = await Dish.findByIdAndDelete(_id)
        if (_.isNil(removed)) throw new ValidationError('DISH_NOT_FOUND')
        return removed
      },
    },
    createOption: {
      type: option,
      args: { input: { type: optionInput } },
      resolve: (__, { input: { name } }) => Option.create({ name }),
    },
    updateOption: {
      type: dish,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }, input: { type: optionInput } },
      resolve: async (__, { _id, input: { name } }) => {
        const updated = await Option.findByIdAndUpdate(_id, { name }, { new: true })
        if (_.isNil(updated)) throw new ValidationError('DISH_NOT_FOUND')
        return updated
      },
    },
    removeOption: {
      type: dish,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const removed = await Option.findByIdAndDelete(_id)
        if (_.isNil(removed)) throw new ValidationError('OPTION_NOT_FOUND')
        return removed
      },
    },
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

const schema = new graphql.GraphQLSchema({ query, mutation })

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  return init()
})
