import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from './metadata'
import { EApiType, IContext } from '../../core/metadata'

export class CreateApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION

  getKey() { return `create${this.model.name}` }

  getApi() {
    return {
      type: this.getType(),
      args: { input: { type: this.getInputType() } },
      resolve: (__, { input }, context: IContext) => {
        this.dbModel.create(input)
      },
    }
  }

  private getInputType() {
    return new graphql.GraphQLInputObjectType({
      name: `${this.model.name}CreateInput`,
      fields: _.omit(this.getFields('write'), '_id')
    })
  }
}
