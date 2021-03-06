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
          create: (input: {}) => {
            return { context, input }
          },
        }
      },
    }

    const generator = new ApiGenerator(<any>dbModel, <any>'modelDefinition')
    expect(await generator['resolve']('parent', { input: 'input' }, 'context'))
      .to.deep.equal({ input: 'input', context: 'context' })
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
      withContext: {

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
