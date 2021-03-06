import * as _ from 'lodash'
import * as graphql from 'graphql'
import { EApiType, EDefaultApis } from '../../metadata'
import { BaseApiGenerator } from '../base-api-generator'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY
  defaultApiType = EDefaultApis.GET_BY_ID

  getKey() { return `get${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) } },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id }, context: any) {
    return this.dbModel.withContext(context).getById(_id)
  }
}
