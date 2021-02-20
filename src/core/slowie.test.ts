import * as td from 'testdouble'
import { createTestClient } from 'apollo-server-testing'
import * as graphql from 'graphql'
import { TestUtils } from '../helpers'
import { expect } from 'chai'
import { Slowie } from './slowie'
import { SchemaLoader } from './schema-loader'
import { ModelBuilder } from './model-builder'

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

  it('#createModel', () => {
    const app = new Slowie(<any>{})
    td.replace(ModelBuilder.prototype, 'getDbModel', () => 'Model')
    td.replace(ModelBuilder.prototype, 'getGraphqlApis', () => ['api1', 'api2'])

    app.createModel(<any>{ name: 'User' })
    expect(app['_models']).to.deep.equal({ User: 'Model' })
    expect(app['_apis']).to.deep.equal(['api1', 'api2'])
  })
})
