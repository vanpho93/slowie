import { customAlphabet } from 'nanoid'
import * as _ from 'lodash'
import * as graphql from 'graphql'
import { Document } from 'mongoose'
import { mongoose } from '../mongoose'
import { ValidationError } from 'apollo-server'

interface IOption {
  _id: string
  name: string
}

const nanoid = customAlphabet('1234567890abcdef', 16)

export const Option = mongoose.model<IOption & Document>('Option', new mongoose.Schema({
  _id: { type: String, default: nanoid },
  name: String,
}))

export const option = new graphql.GraphQLObjectType({
  name: 'Option',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

export const optionInput = new graphql.GraphQLInputObjectType({
  name: 'OptionInput',
  fields: {
    _id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
})

export const createOption = {
  type: option,
  args: { input: { type: optionInput } },
  resolve: (__, { input: { name } }) => Option.create({ name }),
}

export const updateOption = {
  type: option,
  args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }, input: { type: optionInput } },
  resolve: async (__, { _id, input: { name } }) => {
    const updated = await Option.findByIdAndUpdate(_id, { name }, { new: true })
    if (_.isNil(updated)) throw new ValidationError('DISH_NOT_FOUND')
    return updated
  },
}

export const removeOption = {
  type: option,
  args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
  resolve: async (__, { _id }) => {
    const removed = await Option.findByIdAndDelete(_id)
    if (_.isNil(removed)) throw new ValidationError('OPTION_NOT_FOUND')
    return removed
  },
}