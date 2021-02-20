/* istanbul ignore file */

import * as _ from 'lodash'
import { IRequest, Slowie } from './core'
import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'

export enum ERole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export interface IContext {
  userId: string
  role: ERole
}

const app = new Slowie<IContext>({
  context: (req: IRequest) => {
    const token = _.get(req, 'headers.authorization', '{ "role": "GUEST" }')
    return JSON.parse(token)
  },
})

const nanoid = customAlphabet('1234567890abcdef', 16)

app.createModel({
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
      transform: (context: IContext, value: string) => {
        if (context.role === ERole.GUEST) return '****@***.***'
        return value
      },
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
})

app
  .getServer()
  .listen()
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
