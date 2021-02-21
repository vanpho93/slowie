import { app, IContext, ERole } from '../../app'
import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'
import { IUser } from './metadata'

const nanoid = customAlphabet('1234567890abcdef', 16)

app.createModel<IUser>({
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
    },
    presenter: {
      graphql: {
        type: graphql.GraphQLString,
        resolve: () => 'hello',
      },
      hideFromWriteApis: true,
    },
  },
})
