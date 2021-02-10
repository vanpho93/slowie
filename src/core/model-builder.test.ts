import * as td from 'testdouble'
import * as graphql from 'graphql'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { ModelBuilder } from './model-builder'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getDbModel', async () => {
    const modelBuilder = new ModelBuilder({
      name: 'User',
      schema: {
        email: {
          db: { type: String },
          graphql: { type: graphql.GraphQLString },
        },
      },
    })

    const User = modelBuilder.getDbModel()
    const User2 = modelBuilder.getDbModel()
    expect(User).to.deep.equal(User2)

    const { _id } = await User.create({ email: 'abcd@gmail.com' })
    expect(await User.findById(_id)).to.include({ email: 'abcd@gmail.com' })
    await User.deleteMany({})
  })

  it('#getGraphqlApis', () => {
    const modelBuilder = new ModelBuilder(<any> 'sample_model')

    td.replace(modelBuilder, 'getDbModel')
    td.replace(ApiGenerator, 'generate')
    td.when(ApiGenerator.generate(
      td.matchers.anything(),
      td.matchers.anything()
    )).thenReturn(<any>'_api_generators')

    expect(modelBuilder.getGraphqlApis()).to.equal('_api_generators')
  })
})
