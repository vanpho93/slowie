import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { UserInputError } from 'apollo-server'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.REMOVE

  getKey() { return `remove${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id }, context: any) {
    const toBeRemoved = await this.dbModel.findById(_id)
    if (_.isNil(toBeRemoved)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )
    for (const hook of this.dbModel.hook.beforeRemoveHooks) {
      await hook(context, toBeRemoved)
    }

    const result = await this.dbModel.findByIdAndDelete(_id)

    for (const hook of this.dbModel.hook.afterRemoveHooks) {
      await hook(context, result)
    }
    return this.transform(context, result!.toObject())
  }
}
