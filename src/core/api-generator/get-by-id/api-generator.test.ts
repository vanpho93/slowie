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

    it('get successfully', async () => {
      td.replace(generator, 'dbModel', {
        findById(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } } }
        },
      })

      const output = await generator['resolve'](
        TestUtils.NO_MATTER_VALUE('parent'),
        { _id: 'some_id' },
        <any> { role: 'ADMIN' }
      )
      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })
    })

    it('not found', async () => {
      td.replace(generator, 'dbModel', {
        findById(_id: string) { return null },
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
    expect(generator.getKey()).to.equal('getUser')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const dbModel = <any>{
      predefinedTypes: {
        OUTPUT: 'OUTPUT',
      },
    }
    const generator = new ApiGenerator(dbModel, <any>{ name: 'User' })
    td.replace(generator, 'resolve', resolve)

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: 'OUTPUT',
        args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      })

    expect(api.resolve()).to.equal('resolve')
  })
})
