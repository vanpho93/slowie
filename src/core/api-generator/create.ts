import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator, EApiType } from './metadata'

export class CreateApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `create${this.dbModel.collection}` }

  getApi() {
    return {
      type: this.getType(),
      args: { input: { type: this.getInputType() } },
      resolve: (__, { input }) => this.dbModel.create(input),
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType({
      name: `${this.model.name}Input`,
      fields: _.omit(this.getFields, '_id')
    })
  }
}
