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
          paginate: () => {
            return { context, fn: 'list' }
          },
        }
      },
    }

    const generator = new ApiGenerator(<any>dbModel, <any>'modelDefinition')
    expect(await generator['resolve']('parent', {}, 'context'))
      .to.deep.equal({ context: 'context', fn: 'list' })
  })

  it('#getKey', () => {
    const generator = new ApiGenerator(<any>{}, <any>{ name: 'User' })
    expect(generator.getKey()).to.equal('getUsers')
  })

  it('#getApi', () => {
    const resolve = () => 'resolve'
    const dbModel = <any>{
      predefinedTypes: {
        PAGEGINATED_LIST: graphql.GraphQLString,
      },
    }
    const generator = new ApiGenerator(dbModel, <any>{ name: 'User' })
    td.replace(generator, 'resolve', resolve)

    const api = generator.getApi()
    expect(api).to.deep
      .include({
        type: graphql.GraphQLString,
      })

    expect(api.resolve()).to.equal('resolve')
  })
})
