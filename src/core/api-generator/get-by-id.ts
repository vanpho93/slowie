import * as _ from 'lodash'
import * as graphql from 'graphql'
import { ValidationError } from 'apollo-server'
import { EApiType } from '../../core/metadata'
import { BaseApiGenerator } from './metadata'

export class GetByIdApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}` }

  getApi() {
    return {
      type: this.getType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const result = await this.dbModel.findByIdAndDelete(_id)
        if (_.isNil(result)) throw new ValidationError(
          `${this.model.name.toUpperCase()}_NOT_FOUND`
        )
        return result
      }
    }
  }
}