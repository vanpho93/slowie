import * as _ from 'lodash'
import { GraphQLFieldConfigMap } from 'graphql'
import { EApiType } from '../../core/metadata'

export interface IApiGenerator {
  generate(): GraphQLFieldConfigMap<any, any>
  type: EApiType
}
