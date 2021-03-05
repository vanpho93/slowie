import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { UserInputError } from 'apollo-server'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.UPDATE

  getKey() { return `update${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: {
        _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        input: { type: this.dbModel.predefinedTypes.UPDATE_INPUT },
      },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id, input }, context: any) {
    // await this.validate(input, context)
    const current = await this.dbModel.findById(_id)
    if (_.isNil(current)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )

    for (const hook of this.dbModel.hook.beforeUpdateHooks) {
      await hook(context, input, current)
    }

    const result = await this.dbModel.findByIdAndUpdate(_id, input, { new: true })
    for (const hook of this.dbModel.hook.afterUpdateHooks) {
      await hook(context, result, input)
    }
    return this.transform(context, result!.toObject())
  }
}
