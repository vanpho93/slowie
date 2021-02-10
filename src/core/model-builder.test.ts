import * as td from 'testdouble'
import * as graphql from 'graphql'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { ModelBuilder } from './model-builder'

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
})
