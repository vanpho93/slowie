import * as graphql from 'graphql'
import { Document } from 'mongoose'

interface IModel<T> {
  name?: string
  Model?: T & Document
  objectType?: graphql.GraphQLObjectType
  inputType?: graphql.GraphQLInputObjectType
  queries?: any[]
  mutations?: any[]
}

export class ModelBuilder<T> {
  build(): IModel<T> { return {} }
}
