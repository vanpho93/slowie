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

    it('remove successfully', async () => {
      const beforeRemoveHook = td.function()
      const afterRemoveHook = td.function()

      td.replace(generator, 'dbModel', {
        findById(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } }, toBeRemoved: true }
        },
        findByIdAndDelete(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } }, removed: true }
        },
        hook: {
          beforeRemoveHooks: [beforeRemoveHook],
          afterRemoveHooks: [afterRemoveHook],
        },
      })

      const context = <any> { role: 'ADMIN' }
      const output = await generator['resolve'](
        TestUtils.NO_MATTER_VALUE('parent'),
        { _id: 'some_id' },
        context
      )
      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })

      const toBeRemovedObject = { toObject: td.matchers.anything(), toBeRemoved: true }
      const removedObject = { toObject: td.matchers.anything(), removed: true }
      td.verify(beforeRemoveHook(context, toBeRemovedObject))
      td.verify(afterRemoveHook(context, removedObject))
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
    expect(generator.getKey()).to.equal('removeUser')
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
