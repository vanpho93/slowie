// tslint:disable: no-unused-expression
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { SchemaLoader } from './schema-loader'
import { EApiType } from '../core/metadata'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getFieldsByApiType', () => {
    const apis: any = [
      { type: EApiType.MUTATION, generate() { return { updateUser: {} } } },
      { type: EApiType.MUTATION, generate() { return { createUser: {} } } },
      { type: EApiType.QUERY, generate() { return { getUser: {} } } },
    ]
    const mutationFields = SchemaLoader['getFieldsByApiType'](apis, EApiType.MUTATION)
    expect(mutationFields).to.deep.equal({
      updateUser: {},
      createUser: {},
    })

    const queryFields = SchemaLoader['getFieldsByApiType'](apis, EApiType.QUERY)
    expect(queryFields).to.deep.equal({
      getUser: {},
    })
  })

  it('#getSchemaFromApiGenerators', () => {
    td.replace(SchemaLoader, 'getFieldsByApiType', () => ({ data: {} }))

    const config = SchemaLoader.getSchemaFromApiGenerators([]).toConfig()
    expect(config.query!.toConfig().fields).to.ownProperty('data')
    expect(config.mutation!.toConfig().fields).to.ownProperty('data')
  })
})
