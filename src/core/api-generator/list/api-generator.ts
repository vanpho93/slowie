import { graphql } from 'index'
import * as _ from 'lodash'
import { EApiType, EDefaultApis } from '../../metadata'
import { BaseApiGenerator } from '../base-api-generator'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY
  defaultApiType = EDefaultApis.LIST

  getKey() { return `get${this.modelDefinition.name}s` }

  protected getArgs(): graphql.GraphQLFieldConfigArgumentMap | undefined {
    return undefined
  }

  protected getQueryObjectFromInput(input: any): any {
    return _.mapValues(input.where, (x) => _.mapKeys(x, (_value, key) => `$${key}`))
  }

  getApi() {
    return {
      args: this.getArgs(),
      type: this.dbModel.predefinedTypes.PAGEGINATED_LIST,
      resolve: this.resolve.bind(this),
    }
  }

  private async resolve(_parent, input, context: any) {
    return this.dbModel.withContext(context).paginate(
      this.getQueryObjectFromInput(input),
      {
        sort: input.sort,
        offset: input.offset,
        limit: input.limit,
      }
    )
  }
}
