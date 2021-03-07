import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  IModelDefinition,
  IPredefinedTypes,
  IField,
} from '../core/metadata'

export class TypeGenerator {
  constructor(protected modelDefinition: IModelDefinition<any>) { }

  private getFields(fieldName: keyof IField<any, any>['graphql']): _.Dictionary<graphql.GraphQLFieldConfig<any, any>> {

    return _.chain(this.modelDefinition.schema)
      .mapValues(field => {
        if (_.isUndefined(field.graphql[fieldName])) return field.graphql.default
        return field.graphql[fieldName]
      })
      .omitBy(_.isNil)
      .value() as any
  }

  private static _outputTypes = {}
  private static readonly DEFAULT_TYPE = {}

  static getCachedOutputType(name: string): graphql.GraphQLObjectType {
    if (_.isNil(this._outputTypes[name])) {
      this._outputTypes[name] = this.DEFAULT_TYPE
      return this._outputTypes[name]
    }
    return this._outputTypes[name]
  }

  private static setOutputType(name: string, objectType: graphql.GraphQLObjectType) {
    const type = this.getCachedOutputType(name)
    if (type !== this.DEFAULT_TYPE) throw new Error(`${name} declared twice`)
    this._outputTypes[name] = objectType
  }

  private getOutputType(): graphql.GraphQLObjectType {
    const type = new graphql.GraphQLObjectType({
      name: this.modelDefinition.name,
      fields: () => this.getFields('get'),
    })
    TypeGenerator.setOutputType(this.modelDefinition.name, type)
    return type
  }

  private getOutputInListType(): graphql.GraphQLObjectType {
    const type = new graphql.GraphQLObjectType({
      name: `${this.modelDefinition.name}Item`,
      fields: () => this.getFields('list'),
    })
    return type
  }

  private getCreateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.modelDefinition.name}CreateInput`,
      fields: () => this.getFields('create'),
    })
  }

  private getUpdateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.modelDefinition.name}UpdateInput`,
      fields: () => this.getFields('update'),
    })
  }

  private generate() {
    return {
      OUTPUT_IN_LIST: this.getOutputInListType(),
      OUTPUT: this.getOutputType(),
      CREATE_INPUT: this.getCreateInputType(),
      UPDATE_INPUT: this.getUpdateInputType(),
    }
  }

  static generate(model: IModelDefinition<any>): IPredefinedTypes {
    return new TypeGenerator(model).generate()
  }
}
