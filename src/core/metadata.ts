import * as graphql from 'graphql'
import {
  Document,
  Model,
  Schema,
  SchemaTypeOpts,
  SchemaType,
} from 'mongoose'
import { Hook } from './hook'

export interface ITransformFunction<Value, Context> {
  (context: Context, value: Value): null | Value | Promise<null | Value>
}

export interface IValidateFunction<Value, Context> {
  (context: Context, value: Value): void | Promise<void>
}

export interface IField<Context, Value = any> {
  graphql: graphql.GraphQLFieldConfig<any, any>
  db?: SchemaTypeOpts<any> | Schema | SchemaType
  transform?: ITransformFunction<Value, Context>
  validate?: IValidateFunction<Value, Context>
  hideFromReadApis?: boolean
  hideFromWriteApis?: boolean
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
}

export type ISchema<Context> = _.Dictionary<IField<Context>>

export enum EApiType {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
}

export enum EFieldAction {
  READ = 'READ',
  WRITE = 'WRITE',
}

export interface IApiGenerator {
  generate(): graphql.GraphQLFieldConfigMap<any, any>
  type: EApiType
  defaultApiType: EDefaultApis
}

export interface IPredefinedTypes {
  OUTPUT: graphql.GraphQLObjectType
  CREATE_INPUT: graphql.GraphQLInputObjectType
  UPDATE_INPUT: graphql.GraphQLInputObjectType
}

export type ModelOf<T, Context> = Model<T & Document, {}> &
  { hook: Hook<T, Context> } &
  { predefinedTypes: IPredefinedTypes }
