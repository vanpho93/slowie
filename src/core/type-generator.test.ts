import * as td from 'testdouble'
import * as graphql from 'graphql'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { TypeGenerator } from './type-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getFields', () => {
    const apiGenerator = new TypeGenerator(
      <any> {
        schema: {
          field: {
            graphql: {
              default: 'string',
              get: 'number',
              create: null,
            },
          },
        },
      }
    )

    expect(apiGenerator['getFields']('get'))
      .to.deep.equal({ field: 'number' })

    expect(apiGenerator['getFields']('update'))
      .to.deep.equal({ field: 'string' })

    expect(apiGenerator['getFields']('create'))
      .to.deep.equal({})
  })

  it('#getOutputType', () => {
    td.replace(
      TypeGenerator,
      <any> 'setOutputType'
    )
    td.replace(
      TypeGenerator.prototype,
      <any> 'getFields'
    )
    td
      .when(TypeGenerator.prototype['getFields']('get'))
      .thenReturn({ age: { type: graphql.GraphQLInt } })

    const typeGenerator = new TypeGenerator(
      {
        name: 'User',
        schema: {},
      }
    )

    const outputType = typeGenerator['getOutputType']()
    td.verify(TypeGenerator['setOutputType']('User', outputType))
    expect(
      outputType.getFields().age
    ).to.deep.include({ name: 'age', type: graphql.GraphQLInt })
  })

  it('get and set output type', () => {
    expect(TypeGenerator.getCachedOutputType('User')).to.deep.equal(TypeGenerator['DEFAULT_TYPE'])
    expect(TypeGenerator['setOutputType']('User', <any> 'AN_OUTPUT_TYPE'))
    expect(TypeGenerator.getCachedOutputType('User')).to.deep.equal('AN_OUTPUT_TYPE')

    expect(() => TypeGenerator['setOutputType']('User', <any>'AN_OUTPUT_TYPE'))
      .throws('User declared twice')
  })

  it('#getCreateInputType', () => {
    const generator = new TypeGenerator(<any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getCreateInputType']().toConfig()
    expect(config.name).to.equal('CreateUserInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
  })

  it('#getUpdateInputType', () => {
    const generator = new TypeGenerator(<any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getUpdateInputType']().toConfig()
    expect(config.name).to.equal('UpdateUserInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
  })

  it('#generate', () => {
    td.replace(TypeGenerator.prototype, 'getOutputType', () => 1)
    td.replace(TypeGenerator.prototype, 'getCreateInputType', () => 2)
    td.replace(TypeGenerator.prototype, 'getUpdateInputType', () => 3)
    td.replace(TypeGenerator.prototype, 'getOutputInListType', () => 4)

    expect(TypeGenerator.generate(<any>'model'))
      .to.deep.equal({
        OUTPUT: 1,
        CREATE_INPUT: 2,
        UPDATE_INPUT: 3,
        OUTPUT_IN_LIST: 4,
      })
  })
})
