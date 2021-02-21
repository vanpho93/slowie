import * as _ from 'lodash'
import * as graphql from 'graphql'
import { UserInputError } from 'apollo-server'
import { EApiType } from '../../metadata'
import { BaseApiGenerator } from '../base-api-generator'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id }, context: any) {
    const result = await this.dbModel.findById(_id)
    if (_.isNil(result)) throw new UserInputError(
      `${this.model.name.toUpperCase()}_NOT_FOUND`
    )
    return this.transform(context, result.toObject())
  }
}
