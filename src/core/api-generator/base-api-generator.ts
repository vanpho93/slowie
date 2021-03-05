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

  protected transform(context: any, modelValue: T) {
    return _.mapValues(modelValue, (value, key) => {
      const transformField = _.get(this.modelDefinition.schema[key], 'transform')
      if (!transformField) return value
      return transformField(context, value)
    })
  }

  abstract getKey(): string
  abstract getApi(): graphql.GraphQLFieldConfig<any, any>

  protected async validate(input: any, context: any) {
    for (const key of Object.keys(input)) {
      console.log(key)
      const validateFunction = _.get(this.modelDefinition.schema[key], 'validate')
      if (validateFunction) await validateFunction(context, input)
    }
  }
}
