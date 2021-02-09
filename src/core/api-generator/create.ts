import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from './base-api-generator'
import { EApiType, EFieldAction, IContext } from '../../core/metadata'

export class CreateApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `create${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: { input: { type: this.getInputType() } },
      resolve: async (__, { input }, context: IContext) => {
        const result = await this.dbModel.create(input)
        return this.transform(context, result)
      },
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType({
      name: `${this.model.name}CreateInput`,
      fields: _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }
}
