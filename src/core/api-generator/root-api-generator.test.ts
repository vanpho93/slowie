import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../helpers'
import { RootApiGenerator } from './root-api-generator'
import { EDefaultApis } from '../../core/metadata'

class Dummy {
  defaultApiType = EDefaultApis.GET_BY_ID
  constructor(public param1: any, public param2: any) {}
}

class ShouldBeHide {
  defaultApiType = EDefaultApis.CREATE
  constructor(public param1: any, public param2: any) {}
}

describe(TestUtils.getTestTitle(__filename), () => {
  it('#generate', () => {
    td.replace(
      RootApiGenerator,
      'apiGeneratorConstructors',
      [Dummy, ShouldBeHide]
    )

    const model = <any> {
      hideDefaultApis: [EDefaultApis.CREATE],
    }
    expect(
      RootApiGenerator.generate(<any>'DbModel', model)
    ).to.deep.equal(
      [new Dummy('DbModel', model)]
    )
  })
})
