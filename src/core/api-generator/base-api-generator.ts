import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  EApiType,
  IModel,
  IApiGenerator,
  ModelOf,
  EDefaultApis,
} from '../../core/metadata'

export abstract class BaseApiGenerator<T extends object> implements IApiGenerator {
  abstract type: EApiType
  abstract defaultApiType: EDefaultApis

  constructor(
    protected dbModel: ModelOf<T, any>,
    protected model: IModel<any>
  ) { }

  generate() {
    return { [this.getKey()]: this.getApi() }
  }

  protected transform(context: any, modelValue: T) {
    return _.mapValues(modelValue, (value, key) => {
      const transformField = _.get(this.model.schema[key], 'transform')
      if (!transformField) return value
      return transformField(context, value)
    })
  }

  abstract getKey(): string
  abstract getApi(): graphql.GraphQLFieldConfig<any, any>
}
