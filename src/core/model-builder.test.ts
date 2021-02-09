import { customAlphabet } from 'nanoid'
import * as graphql from 'graphql'
import { IModel } from './metadata'

const nanoid = customAlphabet('1234567890abcdef', 16)

const user = {
  name: 'User',
  schema: {
    _id: {
      graphql: { type: graphql.GraphQLString },
      db: {
        type: String,
        default: nanoid,
      }
    },
    email: {
      graphql: { type: graphql.GraphQLString },
      db: { type: String },
    },
    age: {
      graphql: { type: graphql.GraphQLInt },
      db: { type: Number },
    }
  }
};
