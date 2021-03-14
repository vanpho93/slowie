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

export interface ITransformFunction<Value, Context> {
  (context: Context, value: Value): null | Value | Promise<null | Value>
}

export interface IValidateFunction<Value, Context> {
  (context: Context, value: Value): void | Promise<void>
}

export type GraphQLField = graphql.GraphQLFieldConfig<any, any>
export type GraphQLInputField = graphql.GraphQLInputFieldConfig

export interface IField<Context, Value = any> {
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
  transform?: ITransformFunction<Value, Context>
  validate?: IValidateFunction<Value, Context>
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
  OUTPUT_IN_LIST: graphql.GraphQLObjectType
  CREATE_INPUT: graphql.GraphQLInputObjectType
  UPDATE_INPUT: graphql.GraphQLInputObjectType
}

export type ModelOf<T extends object, Context> = Model<T & Document, {}> &
  { hook: Hook<T, Context> } &
  { predefinedTypes: IPredefinedTypes } &
  { withContext: ModelEnricher<T, Context>['withContext'] } &
  PaginateModel<T & Document>
