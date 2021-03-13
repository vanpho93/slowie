import * as td from 'testdouble'
import * as graphql from 'graphql'
import { TestUtils } from '../helpers'
import * as _ from 'lodash'
import { expect } from 'chai'
import { QueryInputTypeBuilder } from './query-input-type-builder'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#build', () => {
    const { type } = new QueryInputTypeBuilder()
      .build()

    expect(type).instanceOf(graphql.GraphQLInputObjectType)
  })

  it('#addQueryField', () => {
    const builder = new QueryInputTypeBuilder()

    builder
      .addQueryField({
        field: 'created',
        operators: ['gte', 'lte'],
        required: true,
        type: graphql.GraphQLString,
      })
      .addQueryField({
        field: 'status',
        operators: ['in'],
        required: false,
        type: graphql.GraphQLString,
      })

    expect(builder['queryFields'].length).to.equal(2)
  })

  it('#getFields', async () => {
    const builder = new QueryInputTypeBuilder()
    td.replace(builder, 'queryFields', [
      {
        field: 'email',
        operators: ['eq', 'in'],
        type: graphql.GraphQLString,
      },
      {
        field: 'email',
        operators: ['exists'],
        type: graphql.GraphQLString,
      },
      {
        field: 'role',
        operators: ['in'],
        require: true,
        type: graphql.GraphQLInt,
      },
    ])

    expect(_.keys(builder['getFields']())).to.deep.equal(
      ['email', 'role']
    )
  })

  it('#getInputTypeByFields', () => {
    const builder = new QueryInputTypeBuilder()
    const inputType = builder['getInputTypeByFields']([
      {
        field: 'email',
        operators: ['eq', 'in'],
        type: graphql.GraphQLString,
      },
      {
        field: 'email',
        operators: ['exists'],
        type: graphql.GraphQLString,
        required: true,
      },
    ])

    const expected = new graphql.GraphQLInputObjectType({
      name: 'RandomName',
      fields: {
        eq: { type: graphql.GraphQLString },
        in: { type: graphql.GraphQLList(graphql.GraphQLString) },
        exists: { type: graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
      },
    })

    expect(inputType.toConfig().fields).to.deep.equal(expected.toConfig().fields)
  })
})
