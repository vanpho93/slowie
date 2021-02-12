import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#resolve', async () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'transform', (context, value) => _.merge(context, value))
    td.replace(generator, 'dbModel', {
      create(input: {}) {
        return _.merge({ _id: 'some_id' }, input)
      },
    })

    const output = await generator['resolve'](
      TestUtils.NO_MATTER_VALUE('parent'),
      { input: { name: 'Brian' } },
      <any> { role: 'ADMIN' }
    )

    expect(output)
      .to.deep
      .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('createUser')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'getOutputType', () => 'output_type')
    td.replace(generator, 'getInputType', () => 'input_type')
    td.replace(generator, 'resolve', resolve)
    expect(generator.getApi())
      .to.deep.equal({
        type: 'output_type',
        args: {
          input: { type: 'input_type' },
        },
        resolve,
      })
  })

  it('#getInputType', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getInputType']().toConfig()
    expect(config.name).to.equal('UserCreateInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
    expect(config.fields._id).to.equal(undefined)
  })
})
