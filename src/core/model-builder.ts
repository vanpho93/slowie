import * as _ from 'lodash'
import { Document } from 'mongoose'
import { IModel } from './metadata'
import { mongoose } from '../mongoose'
import * as graphql from 'graphql'
import { ValidationError } from 'apollo-server'

export class ModelBuilder<T> {
  constructor(private model: IModel) { }
  
  public getDbModel() {
    const schemaDefinition = _.mapValues(this.model.schema, 'db')
    return mongoose.model<T & Document>(
      this.model.name,
      new mongoose.Schema(schemaDefinition)
    )
  }

  public getGraphqlModel() {
    const DbModel = this.getDbModel()
  
    const fields = _.mapValues(this.model.schema, 'graphql')
    const type = new graphql.GraphQLObjectType({
      name: this.model.name,
      fields,
    })

    const inputType = new graphql.GraphQLInputObjectType({
      name: `${this.model.name}Input`,
      fields: _.omit(fields, '_id')
    })

    const create = {
      type,
      args: { input: { type: inputType } },
      resolve: (__, { input }) => DbModel.create(input),
    }

    const list = {
      type: graphql.GraphQLList(type),
      resolve: () => DbModel.find({}),
    }

    const get = {
      type,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const result = await DbModel.findByIdAndDelete(_id)
        if (_.isNil(result)) throw new ValidationError('DISH_NOT_FOUND')
        return result
      },
    }

    const remove = {
      type,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const removed = await DbModel.findByIdAndDelete(_id)
        if (_.isNil(removed)) throw new ValidationError('DISH_NOT_FOUND')
        return removed
      },
    }

    const update = {
      type,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }, input: inputType },
      resolve: async (__, { _id, input }) => {
        const updated = await DbModel.findByIdAndUpdate(_id, input, { new: true })
        if (_.isNil(updated)) throw new ValidationError('DISH_NOT_FOUND')
        return updated
      },
    }

    return { get, list, remove, update, create }
  }
}
