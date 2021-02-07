import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from './metadata'
import { ValidationError } from 'apollo-server'
import { EApiType } from '../../core/metadata'

export class RemoveApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `update${this.model.name}` }

  getApi() {
    return {
      type: this.getType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (__, { _id }) => {
        const removed = await this.dbModel.findByIdAndDelete(_id)
        if (_.isNil(removed)) throw new ValidationError('DISH_NOT_FOUND')
        return removed
      },
    }
  }
}
