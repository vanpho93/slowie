import * as graphql from 'graphql'
import * as _ from 'lodash'
import { EApiType, IContext } from '../../core/metadata'
import { BaseApiGenerator } from './metadata'

export class ListApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}s` }

  getApi() {
    return {
      type: graphql.GraphQLList(this.getType()),
      resolve: async (_parent, _input, context: IContext) => {
        const items = await this.dbModel.find({})
        return items.map((item) => this.transform(context, item.toObject()))
      },
    }
  }
}
