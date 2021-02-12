/* istanbul ignore file */

import * as _ from 'lodash'
import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'
import { ERole, IContext, IModel, transformWrapper } from '../core/metadata'
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
      graphql: { type: graphql.GraphQLString, description: 'GUEST cannot see it' },
      db: { type: String },
      transform: transformWrapper<string>((context: IContext, value: string) => {
        if (context.role === ERole.GUEST) return '****@***.***'
        return value
      }),
    },
    age: {
      graphql: { type: graphql.GraphQLInt },
      db: { type: Number },
    },
    password: {
      graphql: { type: graphql.GraphQLString },
      db: { type: String },
      hideFromReadApis: true,
      hideFromWriteApis: true,
    },
  },
}

export interface IUser {}

const builder = new ModelBuilder<IUser>(userModel)

export const User = builder.getDbModel()
export const apis = builder.getGraphqlApis()
