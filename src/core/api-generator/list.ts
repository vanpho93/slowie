import * as _ from 'lodash'
import { EApiType } from '../../core/metadata'
import { BaseApiGenerator } from './metadata'

export class ListApiGenerator<T> extends BaseApiGenerator<T> {
  type = EApiType.QUERY

  getKey() { return `get${this.model.name}s` }

  getApi() {
    return {
      type: this.getType(),
      resolve: () => this.dbModel.find({}),
    }
  }
}
