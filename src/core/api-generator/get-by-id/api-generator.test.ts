import * as graphql from 'graphql'
import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#resolve', () => {
    const dbModel = {
      withContext(context: any) {
        return {
          remove: (_id: string) => {
            return { context, _id }
          },
        }
      },
    }

    const generator = new ApiGenerator(<any> dbModel, <any>{ name: 'User' })
    generator['resolve']('parent', { _id: 'some_id' }, 'context')
    expect(dbModel.withContext('context').remove('some_id')).to.deep.equal({
      _id: 'some_id',
      context: 'context',
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
