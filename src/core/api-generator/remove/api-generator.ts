import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { UserInputError } from 'apollo-server'
import { EApiType, IContext } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `remove${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: this.resolve,
    }
  }

  private async resolve(_parent, { _id }, context: IContext) {
    const result = await this.dbModel.findByIdAndDelete(_id)
    if (_.isNil(result)) throw new UserInputError(
      `${this.model.name.toUpperCase()}_NOT_FOUND`
    )
    return this.transform(context, result)
  }
}
