import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { UserInputError } from 'apollo-server'
import { EApiType, EFieldAction } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `update${this.model.name}` }

  getApi() {
    return {
      type: this.getOutputType(),
      args: {
        _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        input: {
          type: this.getInputType(),
        },
      },
      resolve: this.resolve.bind(this),
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.model.name}UpdateInput`,
      fields: _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }

  private async resolve(_parent, { _id, input }, context: any) {
    const result = await this.dbModel.findByIdAndUpdate(_id, input, { new: true })
    if (_.isNil(result)) throw new UserInputError(
      `${this.model.name.toUpperCase()}_NOT_FOUND`
    )
    return this.transform(context, result)
  }
}
