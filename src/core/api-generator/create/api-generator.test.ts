import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#resolve', async () => {
    const beforeCreateHook = td.function()
    const afterCreateHook = td.function()

    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'transform', (context, value) => _.merge(context, value))

    td.replace(generator, 'dbModel', {
      create(input: {}) {
        return { toObject() { return _.merge({ _id: 'some_id' }, input) } }
      },
      hook: {
        beforeCreateHooks: [beforeCreateHook],
        afterCreateHooks: [afterCreateHook],
      },
    })

    const context = <any>{ role: 'ADMIN' }
    const input = { name: 'Brian' }

    const output = await generator['resolve'](
      TestUtils.NO_MATTER_VALUE('parent'),
      { input },
      context
    )

    expect(output)
      .to.deep
      .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })

    const created = { toObject: td.matchers.anything() }
    td.verify(beforeCreateHook(context, input))
    td.verify(afterCreateHook(context, created, input))
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('createUser')
  })

  it('#getApi', () => {
    const dbModel = <any>{
      predefinedTypes: {
        OUTPUT: 'OUTPUT',
        CREATE_INPUT: 'CREATE_INPUT',
      },
    }
    const generator = new ApiGenerator(dbModel, <any>{ name: 'User' })
    td.replace(generator, 'getOutputType', () => 'output_type')
    td.replace(generator, 'getInputType', () => 'input_type')
    td.replace(generator, 'resolve', () => 'resolve')

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: 'OUTPUT',
        args: {
          input: { type: 'CREATE_INPUT' },
        },
      })

    expect(api.resolve()).to.equal('resolve')
  })
})
