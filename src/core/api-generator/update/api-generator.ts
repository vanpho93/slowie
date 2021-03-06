import * as _ from 'lodash'
import * as graphql from 'graphql'
import { BaseApiGenerator } from '../base-api-generator'
import { EApiType, EDefaultApis } from '../../metadata'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.MUTATION
  defaultApiType = EDefaultApis.UPDATE

  getKey() { return `update${this.modelDefinition.name}` }

  getApi() {
    return {
      type: this.dbModel.predefinedTypes.OUTPUT,
      args: {
        _id: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        input: { type: this.dbModel.predefinedTypes.UPDATE_INPUT },
      },
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, { _id, input }, context: any) {
    return this.dbModel.withContext(context).update(_id, input)
  }
}
