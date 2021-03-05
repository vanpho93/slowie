import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  IModelDefinition,
  EFieldAction,
  IPredefinedTypes,
} from '../core/metadata'

export class TypeGenerator {
  constructor(protected modelDefinition: IModelDefinition<any>) { }

  private getFields(fieldAction: EFieldAction): _.Dictionary<graphql.GraphQLFieldConfig<any, any>> {
    const filterOption = fieldAction === EFieldAction.READ ? { hideFromReadApis: true } : { hideFromWriteApis: true }
    const hiddenFields = _.chain(this.modelDefinition.schema)
      .map((value, key) => ({ key, ...value }))
      .filter(filterOption)
      .map('key')
      .value()

    return _.chain(this.modelDefinition.schema).omit(hiddenFields).mapValues('graphql').value()
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
      fields: () => this.getFields(EFieldAction.READ),
    })
    TypeGenerator.setOutputType(this.modelDefinition.name, type)
    return type
  }

  private getCreateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.modelDefinition.name}CreateInput`,
      fields: () => _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }

  private getUpdateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.modelDefinition.name}UpdateInput`,
      fields: () => _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }

  private generate() {
    return {
      OUTPUT: this.getOutputType(),
      CREATE_INPUT: this.getCreateInputType(),
      UPDATE_INPUT: this.getUpdateInputType(),
    }
  }

  static generate(model: IModelDefinition<any>): IPredefinedTypes {
    return new TypeGenerator(model).generate()
  }
}
