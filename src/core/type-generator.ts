import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  IModelDefinition,
  IPredefinedTypes,
  IField,
} from '../core/metadata'

type GraphQLFieldName = keyof IField<any, any>['graphql']
type Action = Exclude<GraphQLFieldName, 'read' | 'write' | 'default'>

export class TypeGenerator {
  constructor(protected modelDefinition: IModelDefinition<any>) { }

  private getFields(action: Action): _.Dictionary<graphql.GraphQLFieldConfig<any, any>> {
    const configs: { action: Action, paths: GraphQLFieldName[] }[] = [
      {
        action: 'get',
        paths: ['get', 'read', 'default'],
      },
      {
        action: 'list',
        paths: ['list', 'read', 'default'],
      },
      {
        action: 'create',
        paths: ['create', 'write', 'default'],
      },
      {
        action: 'update',
        paths: ['update', 'write', 'default'],
      },
    ]
    return _.chain(this.modelDefinition.schema)
      .mapValues(field => {
        const { paths } = _.find(configs, { action })!
        for (const path of paths) {
          if (_.isUndefined(field.graphql[path])) continue
          return field.graphql[path]
        }
        return null
      })
      .omitBy(_.isNil)
      .value() as any
  }

  private static _outputTypes = {}
  private static readonly DEFAULT_TYPE = {}

  static getCachedType(name: string): graphql.GraphQLObjectType {
    if (_.isNil(this._outputTypes[name])) {
      this._outputTypes[name] = this.DEFAULT_TYPE
      return this._outputTypes[name]
    }
    return this._outputTypes[name]
  }

  private static setType(name: string, objectType: graphql.GraphQLObjectType | graphql.GraphQLInputObjectType) {
    const type = this.getCachedType(name)
    if (type !== this.DEFAULT_TYPE) throw new Error(`${name} declared twice`)
    this._outputTypes[name] = objectType
  }

  private getOutputType(): graphql.GraphQLObjectType {
    const type = new graphql.GraphQLObjectType({
      name: this.modelDefinition.name,
      fields: () => this.getFields('get'),
    })
    TypeGenerator.setType(this.modelDefinition.name, type)
    return type
  }

  private getOutputInListType(): graphql.GraphQLObjectType {
    const name = `${this.modelDefinition.name}Item`
    const type = new graphql.GraphQLObjectType({
      name,
      fields: () => this.getFields('list'),
    })
    return type
  }

  private getCreateInputType() {
    const name = `Create${this.modelDefinition.name}Input`
    const type = new graphql.GraphQLInputObjectType(<any>{
      name,
      fields: () => this.getFields('create'),
    })
    TypeGenerator.setType(name, type)
    return type
  }

  private getUpdateInputType() {
    const name = `Update${this.modelDefinition.name}Input`
    const type = new graphql.GraphQLInputObjectType(<any>{
      name,
      fields: () => this.getFields('update'),
    })
    return type
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
