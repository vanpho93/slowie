import * as td from 'testdouble'
import * as graphql from 'graphql'
import { expect } from 'chai'
import { EFieldAction } from '../../core/metadata'
import { TestUtils } from '../../helpers'
import { BaseApiGenerator } from './base-api-generator'

class DummyApiGenerator extends BaseApiGenerator<{}> {
  type = TestUtils.NO_MATTER_VALUE()

  getKey() { return 'dummy' }

  getApi() {
    return TestUtils.NO_MATTER_VALUE()
  }
}

describe(TestUtils.getTestTitle(__filename), () => {
  it('#transform', () => {
    const apiGenerator = new DummyApiGenerator(
      TestUtils.NO_MATTER_VALUE('DbModel'),
      <any> {
        schema: {
          shouldRemain: {},
          shouldChange: {
            transform: ({ role }, value: string) => {
              if (role === 'GUEST') return 'abcd'
              return value
            },
          },
        },
      }
    )

    const value = {
      shouldRemain: 'constant',
      shouldChange: 'change_to_abcd_if_role_is_guest',
    }

    expect(
      apiGenerator['transform'](<any>{ role: 'GUEST' }, value)
    ).to.deep.equal({ shouldRemain: 'constant', shouldChange: 'abcd' })

    expect(
      apiGenerator['transform'](<any>{ role: 'ADMIN' }, value)
    ).to.deep.equal(value)
  })

  it('#getFields', () => {
    const apiGenerator = new DummyApiGenerator(
      TestUtils.NO_MATTER_VALUE('DbModel'),
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
      DummyApiGenerator.prototype,
      <any> 'getFields'
    )
    td
      .when(DummyApiGenerator.prototype['getFields'](EFieldAction.READ))
      .thenReturn({ age: { type: graphql.GraphQLInt } })

    const apiGenerator = new DummyApiGenerator(
      TestUtils.NO_MATTER_VALUE('DbModel'),
      {
        name: 'User',
        schema: {},
      }
    )

    expect(
      apiGenerator['getOutputType']().getFields().age
    ).to.deep.include({ name: 'age', type: graphql.GraphQLInt })
  })

  it('#generate', () => {
    td.replace(DummyApiGenerator.prototype, 'getApi', () => 'fake_api')
    expect(DummyApiGenerator.prototype.generate())
      .to.deep.equal({ dummy: 'fake_api' })
  })
})
