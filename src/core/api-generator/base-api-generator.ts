import * as _ from 'lodash'
import * as graphql from 'graphql'
import { Document, Model } from 'mongoose'
import { EApiType, IContext, IModel, EFieldAction, IApiGenerator } from '../../core/metadata'

export abstract class BaseApiGenerator<T extends object> implements IApiGenerator {
  abstract type: EApiType

  constructor(
    protected dbModel: Model<T & Document, {}>,
    protected model: IModel
  ) { }

  protected getFields(fieldAction: EFieldAction = EFieldAction.READ): _.Dictionary<{ type: graphql.GraphQLScalarType }> {
    const filterOption = fieldAction === EFieldAction.READ ? { hideFromReadApis: true } : { hideFromWriteApis: true }
    const hiddenFields = _.chain(this.model.schema)
      .map((value, key) => ({ key, ...value }))
      .filter(filterOption)
      .map('key')
      .value()

    return _.chain(this.model.schema).omit(hiddenFields).mapValues('graphql').value()
  }

  generate() {
    return { [this.getKey()]: this.getApi() }
  }

  static _types = {}

  getType(): graphql.GraphQLObjectType {
    const cached = BaseApiGenerator._types[this.model.name]
    if (_.isNil(cached)) {
      BaseApiGenerator._types[this.model.name] = new graphql.GraphQLObjectType({
        name: this.model.name,
        fields: this.getFields(EFieldAction.READ),
      })
    }
    return BaseApiGenerator._types[this.model.name]
  }

  protected transform(context: IContext, modelValue: T) {
    return _.mapValues(modelValue, (value, key) => {
      const transformField = _.get(this.model.schema[key], 'transform')
      if (!transformField) return value
      return transformField(context, value)
    })
  }

  abstract getKey(): string
  abstract getApi(): graphql.GraphQLFieldConfig<any, any>
}
