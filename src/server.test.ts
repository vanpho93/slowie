import * as td from 'testdouble'
import { createTestClient } from 'apollo-server-testing'
import * as graphql from 'graphql'
import { TestUtils } from './helpers'
import { getServer } from './server'
import { ApiLoader, SchemaLoader } from './app-loader'
import { expect } from 'chai'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getServer', async () => {
    td.replace(ApiLoader, 'getApis', () => 'apisGenerator')
    td.replace(SchemaLoader, 'getSchemaFromApiGenerators')
    td
      .when(SchemaLoader.getSchemaFromApiGenerators(<any>'apisGenerator'))
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

    const server = await getServer()
    const { query } = createTestClient(<any>server)
    const { data } = await query({ query: '{ ping }' })
    expect(data.ping).to.equal('pong')
  })
})
