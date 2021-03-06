import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  EApiType,
  IModelDefinition,
  IApiGenerator,
  ModelOf,
  EDefaultApis,
} from '../../core/metadata'

export abstract class BaseApiGenerator<T extends object> implements IApiGenerator {
  abstract type: EApiType
  abstract defaultApiType: EDefaultApis

  constructor(
    protected dbModel: ModelOf<T, any>,
    protected modelDefinition: IModelDefinition<any>
  ) { }

  generate() {
    return { [this.getKey()]: this.getApi() }
  }

  abstract getKey(): string
  abstract getApi(): graphql.GraphQLFieldConfig<any, any>
}
