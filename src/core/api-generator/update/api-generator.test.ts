import * as graphql from 'graphql'
import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'
import { UserInputError } from 'apollo-server'

describe(TestUtils.getTestTitle(__filename), () => {
  describe('#resolve', () => {
    let generator: ApiGenerator<{}>

    beforeEach(() => {
      generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
      td.replace(generator, 'transform', (context, value) => _.merge(context, value))
    })

    it('update successfully', async () => {
      td.replace(generator, 'dbModel', {
        findByIdAndUpdate(_id: string, input: {}) {
          return { toObject() { return _.merge({ _id }, input) } }
        },
      })

      const output = await generator['resolve'](
        TestUtils.NO_MATTER_VALUE('parent'),
        { _id: 'some_id', input: { name: 'Brian' } },
        <any> { role: 'ADMIN' }
      )

      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })
    })

    it('not found', async () => {
      td.replace(generator, 'dbModel', {
        findByIdAndUpdate(_id: string, input: {}) {
          return null
        },
      })

      const output: UserInputError = await generator['resolve'](
        TestUtils.NO_MATTER_VALUE('parent'),
        TestUtils.NO_MATTER_VALUE('input'),
        TestUtils.NO_MATTER_VALUE('context')
      ).catch(error => error)
      expect(output).to.be.an.instanceOf(UserInputError)
      expect(output.message).to.equal('USER_NOT_FOUND')
    })
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('updateUser')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'getOutputType', () => 'output_type')
    td.replace(generator, 'getInputType', () => 'input_type')
    td.replace(generator, 'resolve', resolve)

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: 'output_type',
        args: {
          _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          input: { type: 'input_type' },
        },
      })
  })

  it('#getInputType', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'getFields', () => ({ _id: {}, name: {} }))
    const config = generator['getInputType']().toConfig()
    expect(config.name).to.equal('UserUpdateInput')
    expect(config.fields.name).to.be.an.instanceOf(Object)
    expect(config.fields._id).to.equal(undefined)
  })
})
