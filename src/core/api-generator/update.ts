import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator, EApiType } from './metadata'
import { ValidationError } from 'apollo-server'

export class UpdateApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `update${this.dbModel.collection}` }

  getApi() {
    return {
      type: this.getType(),
      args: {
        _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        input: {
          type: this.getInputType(),
        }
      },
      resolve: async (__, { _id, input }) => {
        const updated = await this.dbModel.findByIdAndUpdate(_id, input, { new: true })
        if (_.isNil(updated)) throw new ValidationError(
          `${this.model.name.toUpperCase()}_NOT_FOUND`
        )
        return updated
      },
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType({
      name: `${this.model.name}Input`,
      fields: _.omit(this.getFields, '_id')
    })
  }
}
