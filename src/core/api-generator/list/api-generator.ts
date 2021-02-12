import * as graphql from 'graphql'
import * as _ from 'lodash'
import { EApiType, IContext } from '../../metadata'
import { BaseApiGenerator } from '../base-api-generator'

export class ApiGenerator<T extends object> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}s` }

  getApi() {
    return {
      type: graphql.GraphQLList(this.getOutputType()),
      resolve: this.resolve,
    }
  }

  private async resolve(_parent, _input, context: IContext) {
    const items = await this.dbModel.find({})
    return items.map((item) => this.transform(context, item.toObject()))
  }
}