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

    const TestUser = app.createModel({
      name: 'TestUser',
      schema: {
        email: {
          graphql: {
            default: { type: graphql.GraphQLString },
          },
          db: { type: String },
        },
      },
    })

    await TestUser.deleteMany({})

    const users = [
      { email: 'email1@gmail.com' },
      { email: 'email2@gmail.com' },
    ]
    await TestUser.insertMany(users)

    const server = app.getServer()
    const { query } = createTestClient(<any>server)
    const { data } = await query({ query: '{ getTestUsers { email } }' })
    expect(data.getTestUsers).to.deep.equal(users)
  })
})
