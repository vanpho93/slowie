import * as td from 'testdouble'
import * as graphql from 'graphql'
import { expect } from 'chai'
import { EFieldAction } from '../core/metadata'
import { TestUtils } from '../helpers'
import { TypeGenerator } from './type-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getFields', () => {
    const apiGenerator = new TypeGenerator(
      <any> {
        schema: {
          both: {
            graphql: {},
          },
          onlyRead: {
            graphql: {},
            hideFromWriteApis: true,
          },
          onlyWrite: {
            graphql: {},
            hideFromReadApis: true,
          },
        },
      }
    )

    expect(apiGenerator['getFields'](EFieldAction.READ))
      .to.deep.equal({ both: {}, onlyRead: {} })

    expect(apiGenerator['getFields'](EFieldAction.WRITE))
      .to.deep.equal({ both: {}, onlyWrite: {} })
  })

  it('#getOutputType', () => {
    td.replace(
      TypeGenerator.prototype,
      <any> 'getFields'
    )
    td
      .when(TypeGenerator.prototype['getFields'](EFieldAction.READ))
      .thenReturn({ age: { type: graphql.GraphQLInt } })

    const typeGenerator = new TypeGenerator(
      {
        name: 'User',
        schema: {},
      }
    )

    const outputType = typeGenerator['getOutputType']()
    expect(
      outputType.getFields().age
    ).to.deep.include({ name: 'age', type: graphql.GraphQLInt })
  })

  it('#getCreateInputType', () => {
    const generator = new TypeGenerator(<any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getCreateInputType']().toConfig()
    expect(config.name).to.equal('UserCreateInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
    expect(config.fields._id).to.equal(undefined)
  })

  it('#getUpdateInputType', () => {
    const generator = new TypeGenerator(<any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getUpdateInputType']().toConfig()
    expect(config.name).to.equal('UserUpdateInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
    expect(config.fields._id).to.equal(undefined)
  })

  it('#generate', () => {
    td.replace(TypeGenerator.prototype, 'getOutputType', () => 1)
    td.replace(TypeGenerator.prototype, 'getCreateInputType', () => 2)
    td.replace(TypeGenerator.prototype, 'getUpdateInputType', () => 3)

    expect(TypeGenerator.generate(<any>'model'))
      .to.deep.equal({
        OUTPUT: 1,
        CREATE_INPUT: 2,
        UPDATE_INPUT: 3,
      })
  })
})
