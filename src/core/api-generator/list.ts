import * as _ from 'lodash'
import { BaseApiGenerator, EApiType } from './metadata'

export class ListApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.dbModel.collection}s` }

  getApi() {
    return {
      type: this.getType(),
      resolve: () => this.dbModel.find({}),
    }
  }
}
