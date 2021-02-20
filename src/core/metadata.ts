import * as graphql from 'graphql'
import { SchemaDefinition } from 'mongoose'

export interface ITransformFunction<Value, Context> {
  (context: Context, value: Value): null | Value | Promise<null | Value>
}

// for strong typed purpose
export function transformWrapper<Value, Context>(fn: ITransformFunction<Value, Context>) {
  return fn
}

export interface IField<Context, Value = any> {
  graphql: { type: graphql.GraphQLScalarType, description?: string }
  db: SchemaDefinition
  transform?: ITransformFunction<Value, Context>
  hideFromReadApis?: boolean
  hideFromWriteApis?: boolean
}

export enum ERole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
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
