import * as td from 'testdouble'
import { createTestClient } from 'apollo-server-testing'
import * as graphql from 'graphql'
import { TestUtils } from '../helpers'
import { expect } from 'chai'
import { Slowie } from './slowie'
import { SchemaLoader } from './schema-loader'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getServer', async () => {
    td.replace(SchemaLoader, 'getSchemaFromApiGenerators')
    td
      .when(SchemaLoader.getSchemaFromApiGenerators(td.matchers.anything()))
      .thenResolve(new graphql.GraphQLSchema({
          query: new graphql.GraphQLObjectType({
            name: 'Query',
            fields: {
              ping: {
                type: graphql.GraphQLString,
                resolve: () => 'pong',
              },
            },
          }),
      }))

    const server = new Slowie<any>({ context: () => Promise.resolve({}) }).getServer()
    const { query } = createTestClient(<any>server)
    const { data } = await query({ query: '{ ping }' })
    expect(data.ping).to.equal('pong')
  })
})
