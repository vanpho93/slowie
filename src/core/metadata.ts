import * as graphql from 'graphql'
import { SchemaDefinition } from 'mongoose'

export interface ITransformFunction<Value, Context> {
  (context: Context, value: Value): null | Value | Promise<null | Value>
}

export interface IField<Context, Value = any> {
  graphql: graphql.GraphQLFieldConfig<any, any>
  db?: SchemaDefinition
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
