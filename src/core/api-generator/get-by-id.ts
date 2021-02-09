import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ValidationError } from 'apollo-server'
import { EApiType, IContext } from '../../core/metadata'
import { BaseApiGenerator } from './base-api-generator'

export class GetByIdApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}` }

  getApi() {
    return {
      type: this.getType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (_parent, { _id }, context: IContext) => {
        const result = await this.dbModel.findById(_id)
        if (_.isNil(result)) throw new ValidationError(
          `${this.model.name.toUpperCase()}_NOT_FOUND`
        )
        return this.transform(context, result)
      },
    }
  }
}
