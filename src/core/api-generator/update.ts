import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from './metadata'
import { ValidationError } from 'apollo-server'
import { EApiType, IContext } from '../../core/metadata'

export class UpdateApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `update${this.model.name}` }

  getApi() {
    return {
      type: this.getType(),
      args: {
        _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        input: {
          type: this.getInputType(),
        }
      },
      resolve: async (__, { _id, input }, context: IContext) => {
        const result = await this.dbModel.findByIdAndUpdate(_id, input, { new: true })
        if (_.isNil(result)) throw new ValidationError(
          `${this.model.name.toUpperCase()}_NOT_FOUND`
        )
        return this.transform(context, result)
      },
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType({
      name: `${this.model.name}UpdateInput`,
      fields: _.omit(this.getFields(), '_id')
    })
  }
}
