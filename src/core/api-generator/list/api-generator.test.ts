import * as graphql from 'graphql'
import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { TestUtils } from '../../../helpers'
import { ApiGenerator } from './api-generator'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#resolve', async () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    td.replace(generator, 'transform', (context, value) => ({ ...context, ...value }))
    td.replace(generator, 'dbModel', {
      find() {
        return [
          { toObject() { return { _id: 'a', name: 'a' } } },
          { toObject() { return { _id: 'b', name: 'b' } } },
        ]
      },
    })

    const output = await generator['resolve'](
      TestUtils.NO_MATTER_VALUE('parent'),
      undefined,
      <any> { role: 'ADMIN' }
    )

    expect(output)
      .to.deep
      .equal([
        { _id: 'a', name: 'a', role: 'ADMIN' },
        { _id: 'b', name: 'b', role: 'ADMIN' },
      ])
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('getUsers')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const dbModel = <any>{
      predefinedTypes: {
        OUTPUT: graphql.GraphQLString,
      },
    }
    const generator = new ApiGenerator(dbModel, <any>{ name: 'User' })
    td.replace(generator, 'resolve', resolve)

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: graphql.GraphQLList(graphql.GraphQLString),
      })

    expect(api.resolve()).to.equal('resolve')
  })
})
