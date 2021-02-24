import * as td from 'testdouble'
import { expect } from 'chai'
import { EDefaultApis } from '../../core/metadata'
import { TestUtils } from '../../helpers'
import { BaseApiGenerator } from './base-api-generator'

class DummyApiGenerator extends BaseApiGenerator<{}> {
  type = TestUtils.NO_MATTER_VALUE()
  defaultApiType: EDefaultApis.GET_BY_ID

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

  it('#generate', () => {
    td.replace(DummyApiGenerator.prototype, 'getApi', () => 'fake_api')
    expect(DummyApiGenerator.prototype.generate())
      .to.deep.equal({ dummy: 'fake_api' })
  })
})
