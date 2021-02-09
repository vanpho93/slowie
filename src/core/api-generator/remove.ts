import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from './base-api-generator'
import { ValidationError } from 'apollo-server'
import { EApiType, IContext } from '../../core/metadata'

export class RemoveApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `remove${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: async (_parent, { _id }, context: IContext) => {
        const result = await this.dbModel.findByIdAndDelete(_id)
        if (_.isNil(result)) throw new ValidationError('DISH_NOT_FOUND')
        return this.transform(context, result)
      },
    }
  }
}
