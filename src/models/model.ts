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
  private name: string = ''

  setName(name: string) {
    this.name = name
    return this
  }

  build(): IModel<T> { return {} }
}
