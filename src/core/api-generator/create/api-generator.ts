import * as _ from 'lodash'
import { BaseApiGenerator } from '../base-api-generator'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.CREATE

  getKey() { return `create${this.model.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: { input: { type: this.dbModel.predefinedTypes.CREATE_INPUT } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { input }, context: any) {
    for (const hook of this.dbModel.hook.beforeCreateHooks) {
      await hook(context, input)
    }

    const result = await this.dbModel.create(input)

    for (const hook of this.dbModel.hook.afterCreateHooks) {
      await hook(context, result, input)
    }
    return this.transform(context, result.toObject())
  }
}
