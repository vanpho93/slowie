import * as graphql from 'graphql'
import { SchemaDefinition } from 'mongoose'

export interface IField {
  graphql: { type: graphql.GraphQLScalarType }
  db: SchemaDefinition
}

export interface IModel {
  name: string
  schema: ISchema
}

export type ISchema = { [key: string]: IField /* | IFieldDefinition */ } 

export enum EApiType {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
}
