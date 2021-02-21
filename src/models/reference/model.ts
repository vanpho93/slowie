/* istanbul ignore file */

import { app } from '../../app'
import * as graphql from 'graphql'
import { customAlphabet } from 'nanoid'
import { IReference } from './metadata'

const nanoid = customAlphabet('1234567890abcdef', 16)

const Model = app.createModel<IReference>({
  name: 'Reference',
  schema: {
    _id: {
      graphql: { type: graphql.GraphQLString },
      db: {
        type: String,
        default: nanoid,
      },
    },
    userId: {
      graphql: { type: graphql.GraphQLString },
      db: { type: String, required: true },
    },
    level: {
      graphql: { type: graphql.GraphQLInt },
      db: { type: Number, required: true },
    },
    presenterId: {
      graphql: { type: graphql.GraphQLString },
      db: { type: String },
    },
    presenter: {
      graphql: {
        type: new graphql.GraphQLObjectType({
          name: 'Presenter',
          fields: {
            email: { type: graphql.GraphQLString },
            age: { type: graphql.GraphQLInt },
          },
        }),
        resolve: (parent: { presenterId: string }) => {
          return app.getModel('User').findById(parent.presenterId)
        },
      },
      hideFromWriteApis: true,
    },
  },
})

Model.createIndexes(<any> { presenterId: 1, userId: 'unique' })
