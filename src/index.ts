/* istanbul ignore file */
// import { getServer } from './server'

// getServer()
//   .then(server => server.listen())
//   .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
import * as _ from 'lodash'
import { IRequest, Slowie } from './core/slowie'
import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'
import { ERole, transformWrapper } from './core/metadata'

export interface IContext {
  userId: string
  role: 'GUEST' | 'USER' | 'ADMIN'
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

app.start()
