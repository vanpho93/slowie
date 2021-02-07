import * as _ from 'lodash'
import * as graphql from 'graphql'
import { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql'
import { Document, Model } from 'mongoose'
import { EApiType, IModel } from '../../core/metadata'

export interface IApiGenerator {
  generate(): GraphQLFieldConfigMap<any, any>
  type: EApiType
}

export abstract class BaseApiGenerator<T> implements IApiGenerator {
  abstract type: EApiType

  constructor(
    protected dbModel: Model<T & Document, {}>,
    protected model: IModel
  ) { }

  getFields(): _.Dictionary<{ type: graphql.GraphQLScalarType }> {
    return _.mapValues(this.model.schema, 'graphql')
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
        fields: this.getFields(),
      })
    }
    return BaseApiGenerator._types[this.model.name]
  }

  abstract getKey(): string
  abstract getApi(): GraphQLFieldConfig<any, any>
}
