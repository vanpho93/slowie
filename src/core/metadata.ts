import * as graphql from 'graphql'
import {
  Document,
  Model,
  Schema,
  SchemaTypeOpts,
  SchemaType,
  PaginateModel,
} from 'mongoose'
import { Hook } from './hook'
import { ModelEnricher } from './model-enricher'

export interface ITransformFunction<FieldType, Context, ObjectType> {
  (context: Context, value: FieldType, obj: ObjectType): null | FieldType | Promise<null | FieldType>
}

export interface IValidateFunction<FieldType, Context, ObjectType> {
  (context: Context, value: FieldType, obj: ObjectType): void | Promise<void>
}

export type GraphQLField = graphql.GraphQLFieldConfig<any, any>
export type GraphQLInputField = graphql.GraphQLInputFieldConfig

export interface IField<Context, FieldType = any, InputType = any, ObjectType = any> {
  graphql: {
    default?: GraphQLField | null
    read?: GraphQLField | null
    get?: GraphQLField | null
    write?: GraphQLInputField | null
    create?: GraphQLInputField | null
    update?: GraphQLInputField | null
    list?: GraphQLField | null
  }
  db?: SchemaTypeOpts<any> | Schema | SchemaType
  transformOnCreate?: ITransformFunction<FieldType, Context, ObjectType>
  transformOnUpdate?: ITransformFunction<FieldType, Context, ObjectType>
  transform?: ITransformFunction<FieldType, Context, InputType>
  validate?: IValidateFunction<FieldType, Context, InputType>
}

export enum EDefaultApis {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  GET_BY_ID = 'GET_BY_ID',
  LIST = 'LIST',
}

export interface IModelDefinition<Context> {
  name: string
  schema: ISchema<Context>
  hideDefaultApis?: EDefaultApis[]
  skipTimestamp?: boolean
}

export type ISchema<Context> = _.Dictionary<IField<Context>>

export enum EApiType {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
}

export type IApiEndpoint = graphql.GraphQLFieldConfigMap<any, any>

export interface IApi {
  endpoint: IApiEndpoint
  type: EApiType
}

export interface IApiGenerator {
  generate(): IApiEndpoint
  type: EApiType
  defaultApiType: EDefaultApis
}

export interface IPredefinedTypes {
  OUTPUT: graphql.GraphQLObjectType
  PAGEGINATED_LIST: graphql.GraphQLObjectType
  CREATE_INPUT: graphql.GraphQLInputObjectType
  UPDATE_INPUT: graphql.GraphQLInputObjectType
}

export type ModelOf<T extends object, Context> = Model<T & Document, {}> &
  { hook: Hook<T, Context> } &
  { predefinedTypes: IPredefinedTypes } &
  { withContext: ModelEnricher<T, Context>['withContext'] } &
  PaginateModel<T & Document>
