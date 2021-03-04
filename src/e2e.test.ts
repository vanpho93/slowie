import * as graphql from 'graphql'
import { expect } from 'chai'
import { TestUtils } from './helpers'
import { Slowie } from '.'
import { createTestClient } from 'apollo-server-testing'

describe(TestUtils.getTestTitle(__filename), () => {
  it('e2e test', async () => {
    const app = new Slowie<{}>({
      context: () => Promise.resolve({}),
    })

    const User = app.createModel({
      name: 'User',
      schema: {
        email: {
          graphql: { type: graphql.GraphQLString },
          db: { type: String },
        },
      },
    })

    await User.deleteMany({})

    const users = [
      { email: 'email1@gmail.com' },
      { email: 'email2@gmail.com' },
    ]
    await User.insertMany(users)

    const server = app.getServer()
    const { query } = createTestClient(<any>server)
    const { data } = await query({ query: '{ getUsers { email } }' })
    expect(data.getUsers).to.deep.equal(users)
  })
})
