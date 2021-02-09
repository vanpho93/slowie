import * as graphql from 'graphql'
import { SchemaDefinition } from 'mongoose'

export interface TTransformFunction<T = any> {
  (context: IContext, value: T): null | T | Promise<null | T>
}

// for strong typed purpose
export function transformWrapper<T>(fn: TTransformFunction<T>) {
  return fn
}

export interface IField {
  graphql: { type: graphql.GraphQLScalarType, description?: string }
  db: SchemaDefinition
  transform?: TTransformFunction
  hideFromReadApis?: boolean
  hideFromWriteApis?: boolean
}

export enum ERole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export interface IContext {
  userId: string
  role: ERole
}

export interface IModel {
  name: string
  schema: ISchema
}

export type ISchema = _.Dictionary<IField>

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
