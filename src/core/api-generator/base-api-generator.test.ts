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
  it('#generate', () => {
    td.replace(DummyApiGenerator.prototype, 'getApi', () => 'fake_api')
    expect(DummyApiGenerator.prototype.generate())
      .to.deep.equal({ dummy: 'fake_api' })
  })
})
