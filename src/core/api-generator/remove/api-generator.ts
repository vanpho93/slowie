import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.REMOVE

  getKey() { return `remove${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id }, context: any) {
    return this.dbModel.withContext(context).remove(_id)
  }
}
