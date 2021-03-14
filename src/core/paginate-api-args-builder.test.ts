import * as td from 'testdouble'
import * as graphql from 'graphql'
import { TestUtils } from '../helpers'
import * as _ from 'lodash'
import { expect } from 'chai'
import { PaginateApiArgsBuilder, sortDirection } from './paginate-api-args-builder'

describe(TestUtils.getTestTitle(__filename), () => {
  let builder: PaginateApiArgsBuilder

  beforeEach(() => {
    builder = new PaginateApiArgsBuilder()
  })

  it('#build', () => {
    td.replace(builder, 'getWhere', () => 'where')
    td.replace(builder, 'getSort', () => null)
    expect(builder.setDefaultLimit(20).build())
      .to.deep.equal({
        offset: { type: graphql.GraphQLInt, defaultValue: 0 },
        limit: { type: graphql.GraphQLInt, defaultValue: 20 },
        where: 'where',
      })
  })

  describe('#getWhere', () => {
    it('null case', () => {
      expect(builder['getWhere']()).to.equal(null)
    })

    it('no required', () => {
      const mockFields = { a: { type: graphql.GraphQLString } }
      td.replace(builder, 'getFields', () => mockFields)
      td.replace(builder, 'queryFields', [{ required: false }])

      td.replace(builder, 'name', 'Test')
      const expectedResult = new graphql.GraphQLInputObjectType({
        name: `TestWhere`,
        fields: mockFields,
      })
      expect(builder['getWhere']()!.type['toConfig']())
        .to.deep.equal(expectedResult.toConfig())
    })

    it('has required', () => {
      const mockFields = { a: { type: graphql.GraphQLString } }
      td.replace(builder, 'getFields', () => mockFields)
      td.replace(builder, 'queryFields', [{ required: true }])

      td.replace(builder, 'name', 'Test')
      expect(graphql.isNonNullType(builder['getWhere']()!.type)).to.equal(true)
    })
  })

  it('#addQueryField', () => {
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
        required: true,
        type: graphql.GraphQLInt,
      },
    ])

    const fields = builder['getFields']()
    expect(fields.email.type['toConfig']().fields).to.have.keys([
      'eq', 'in', 'exists',
    ])

    expect(graphql.isNonNullType(fields.role.type)).to.equal(true)
  })

  it('#getInputTypeByFields', () => {
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

  it('#setName', () => {
    builder.setName('SomeName')
    expect(builder['name']).to.equal('SomeName')
  })

  it('#addSortableFields', () => {
    builder
      .addSortableFields(['a', 'b'])
      .addSortableFields(['b', 'c'])

    expect(builder['sortableFields']).to.deep.equal(['a', 'b', 'c'])
  })

  describe('#getSort', () => {
    it('null case', () => {
      expect(builder['getSort']()).to.equal(null)
    })

    it('has value', () => {
      td.replace(builder, 'name', 'Test')
      td.replace(builder, 'sortableFields', ['x', 'y', 'z'])
      const expectedResult = new graphql.GraphQLInputObjectType({
        name: `TestSort`,
        fields: {
          x: { type: sortDirection },
          y: { type: sortDirection },
          z: { type: sortDirection },
        },
      })
      expect(builder['getSort']()?.type.toConfig())
        .to.deep.equal(expectedResult.toConfig())
    })
  })
})
