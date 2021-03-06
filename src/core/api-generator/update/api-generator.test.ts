import * as graphql from 'graphql'
import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#resolve', async () => {
    const dbModel = {
      withContext(context: any) {
        return {
          update: (_id: string, input: {}) => {
            return { context, input, _id }
          },
        }
      },
    }

    const generator = new ApiGenerator(<any> dbModel, <any>{ name: 'User' })
    expect(await generator['resolve']('parent', { input: 'input', _id: 'some_id' }, 'context'))
      .to.deep.equal({ input: 'input', context: 'context', _id: 'some_id' })
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('updateUser')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const dbModel = <any>{
      predefinedTypes: {
        OUTPUT: 'OUTPUT',
        UPDATE_INPUT: 'UPDATE_INPUT',
      },
    }
    const generator = new ApiGenerator(dbModel, <any>{ name: 'User' })
    td.replace(generator, 'resolve', resolve)

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: 'OUTPUT',
        args: {
          _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          input: { type: 'UPDATE_INPUT' },
        },
      })
  })
})
