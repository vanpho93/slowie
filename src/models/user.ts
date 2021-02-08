import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'
import { ERole, IContext, IModel } from '../core/metadata'
import { ModelBuilder } from '../core/model-builder'

const nanoid = customAlphabet('1234567890abcdef', 16)

const userModel: IModel = {
  name: 'User',
  schema: {
    _id: {
      graphql: { type: graphql.GraphQLString },
      db: {
        type: String,
        default: nanoid,
      },
    },
    email: {
      graphql: {  type: graphql.GraphQLString  },
      db: { type: String },
    },
    age: {
      graphql: { type: graphql.GraphQLInt },
      db: { type: Number },
    },
    password: {
      graphql: {  type: graphql.GraphQLString  },
      db: { type: String },
      canGet: (context: IContext) => context.role === ERole.ADMIN
    }
  }
}

interface IUser {}

export const builder = new ModelBuilder<IUser>(userModel)

export const User = builder.getDbModel()
export const apis = builder.getGraphqlApis()
