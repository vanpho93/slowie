import { customAlphabet } from 'nanoid'
import * as _ from 'lodash'
import { ValidationError } from 'apollo-server'
import * as graphql from 'graphql'
import { Document } from 'mongoose'
import { mongoose } from '../mongoose'
import { Option, option } from './option'

interface IDish {
  _id: string
  name: string
  optionIds: string[]
}

const nanoid = customAlphabet('1234567890abcdef', 16)

export const Dish = mongoose.model<IDish & Document>('Dish', new mongoose.Schema({
  _id: { type: String, default: nanoid },
  name: String,
  optionIds: [String],
}))

export const dish = new graphql.GraphQLObjectType({
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

export const dishInput = new graphql.GraphQLInputObjectType({
  name: 'DishInput',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    optionIds: { type: graphql.GraphQLList(graphql.GraphQLString) },
  }
})

export const dishes = {
  type: graphql.GraphQLList(dish),
  resolve: () => Dish.find({}),
}

export const dishQuery = {
  type: dish,
  args: {
    _id: { type: graphql.GraphQLString }
  },
  resolve: (_, { _id }) => Dish.findById(_id),
}

export const createDish = {
  type: dish,
  args: { input: { type: dishInput } },
  resolve: (__, { input: { name, optionIds } }) => Dish.create({ name, optionIds }),
}

export const updateDish = {
  type: dish,
  args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }, input: { type: dishInput } },
  resolve: async (__, { _id, input: { name, optionIds } }) => {
    const updated = await Dish.findByIdAndUpdate(_id, { name, optionIds }, { new: true })
    if (_.isNil(updated)) throw new ValidationError('DISH_NOT_FOUND')
    return updated
  },
}

export const removeDish = {
  type: dish,
  args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
  resolve: async (__, { _id }) => {
    const removed = await Dish.findByIdAndDelete(_id)
    if (_.isNil(removed)) throw new ValidationError('DISH_NOT_FOUND')
    return removed
  },
}
