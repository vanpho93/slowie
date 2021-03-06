import * as _ from 'lodash'
import { BaseApiGenerator } from '../base-api-generator'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.CREATE

  getKey() { return `create${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: { input: { type: this.dbModel.predefinedTypes.CREATE_INPUT } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent: any, { input }, context: any) {
    return this.dbModel.withContext(context).create(input)
  }
}
