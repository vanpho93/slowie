import { expect } from 'chai'
import { EFieldAction } from '../../core/metadata'
import { TestUtils, Value } from '../../helpers'
import { BaseApiGenerator } from './base-api-generator'

class DummyApiGenerator extends BaseApiGenerator<{}> {
  type = Value.NO_MATTER()

  getKey() { return 'dummy' }

  getApi() {
    return Value.NO_MATTER_OBJECT()
  }
}

describe(TestUtils.getTestTitle(__filename), () => {
  it('#transform', () => {
    const apiGenerator = new DummyApiGenerator(
      Value.NO_MATTER('DbModel'),
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
      apiGenerator['transform'](Value.wrap({ role: 'GUEST' }), value)
    ).to.deep.equal({ shouldRemain: 'constant', shouldChange: 'abcd' })

    expect(
      apiGenerator['transform'](Value.wrap({ role: 'ADMIN' }), value)
    ).to.deep.equal(value)
  })

  it('#getFields', () => {
    const apiGenerator = new DummyApiGenerator(
      Value.NO_MATTER('DbModel'),
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
})
