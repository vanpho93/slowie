import { customAlphabet } from 'nanoid'
import * as _ from 'lodash'
import * as graphql from 'graphql'
import { SchemaDefinition } from 'mongoose'

export interface IField {
  graphqlType: graphql.GraphQLOutputType
  appearInCreateApi?: boolean
  appearInUpdateApi?: boolean
  dbType: SchemaDefinition
}

export type IFieldDefinition = { [key: string]: IField | IFieldDefinition } 

const nanoid = customAlphabet('1234567890abcdef', 16)

export const presets: { [key: string]: Partial<IField> } = {
  ID: {
    graphqlType: graphql.GraphQLString,
    dbType: { type: String, default: nanoid },
  },
  STRING: {
    graphqlType: graphql.GraphQLString,
    dbType: { type: String },
  },
  STRING_ARRAY: {
    graphqlType: graphql.GraphQLList(graphql.GraphQLString),
    dbType: { type: [String] },
  }
}

export class FieldBuilder {
  private init: IField = {
    graphqlType: graphql.GraphQLString,
    appearInCreateApi: true,
    appearInUpdateApi: true,
    dbType: { type: String },
  }

  set(config: Partial<IField>) {
    this.init = _.defaultsDeep(this.init, config)
    return this
  }

  get() { return this.init }
}
