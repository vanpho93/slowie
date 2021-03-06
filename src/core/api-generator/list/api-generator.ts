import * as graphql from 'graphql'
import * as _ from 'lodash'
import { EApiType, EDefaultApis } from '../../metadata'
import { BaseApiGenerator } from '../base-api-generator'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY
  defaultApiType = EDefaultApis.LIST

  getKey() { return `get${this.modelDefinition.name}s` }

  getApi() {
    return {
      type: graphql.GraphQLList(this.dbModel.predefinedTypes.OUTPUT),
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, _input, context: any) {
    return this.dbModel.withContext(context).list()
  }
}
