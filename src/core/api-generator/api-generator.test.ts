import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../helpers'
import { ApiGenerator } from './api-generator'

class Dummy {
  constructor(public param1: any, public param2: any) {}
}

describe(TestUtils.getTestTitle(__filename), () => {
  it('#generate', () => {
    td.replace(
      ApiGenerator,
      'apiGeneratorConstructors',
      [Dummy]
    )

    expect(
      ApiGenerator.generate(<any>'DbModel', <any>'modelDefinition')
    ).to.deep.equal(
      [new Dummy('DbModel', 'modelDefinition')]
    )
  })
})
