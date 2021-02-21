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

export interface IField<Context, Value = any> {
  graphql: graphql.GraphQLFieldConfig<any, any>
  db?: SchemaTypeOpts<any> | Schema | SchemaType
  transform?: ITransformFunction<Value, Context>
  hideFromReadApis?: boolean
  hideFromWriteApis?: boolean
}

export interface IModel<Context> {
  name: string
  schema: ISchema<Context>
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
}

export type ModelOf<T, Context> = Model<T & Document, {}> & { hook: Hook<T, Context> }
