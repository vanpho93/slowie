import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../helpers'
import { RootApiGenerator } from './root-api-generator'

class Dummy {
  constructor(public param1: any, public param2: any) {}
}

describe(TestUtils.getTestTitle(__filename), () => {
  it('#generate', () => {
    td.replace(
      RootApiGenerator,
      'apiGeneratorConstructors',
      [Dummy]
    )

    expect(
      RootApiGenerator.generate(<any>'DbModel', <any>'modelDefinition')
    ).to.deep.equal(
      [new Dummy('DbModel', 'modelDefinition')]
    )
  })
})
