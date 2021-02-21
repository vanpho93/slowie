import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { EApiType, EDefaultApis, EFieldAction } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.CREATE

  getKey() { return `create${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: { input: { type: this.getInputType() } },
      resolve: this.resolve.bind(this),
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.model.name}CreateInput`,
      fields: _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
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
