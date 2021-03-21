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

export interface ITransformFromField<FieldType, Context> {
  (tranformInput: { context: Context, value: FieldType }): null | FieldType | Promise<null | FieldType>
}

export interface ITransformFromFieldWithInput<FieldType, Context, Input = any> extends ITransformFromField<FieldType, Context> {
  (tranformInput: { context: Context, value: FieldType, input: Input }): null | FieldType | Promise<null | FieldType>
}

export interface ITransformFromFieldWithInputAndCurrentValue<FieldType, Context, Input = any, CurrentValue = Input> extends ITransformFromFieldWithInput<FieldType, Context, Input> {
  (tranformInput: { context: Context, value: FieldType, input: Input, currentValut: CurrentValue }): null | FieldType | Promise<null | FieldType>
}

export interface IValidateFunction<FieldType, Context, ObjectType> {
  (context: Context, value: FieldType, obj: ObjectType): void | Promise<void>
}

export type GraphQLField = graphql.GraphQLFieldConfig<any, any>
export type GraphQLInputField = graphql.GraphQLInputFieldConfig

export interface IField<Context, FieldType = any, InputType = any, ObjectType = InputType> {
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
  transform?: ITransformFunction<FieldType, Context, InputType>
  newTransform?: {
    default?: ITransformFromField<FieldType, Context>
    read?: ITransformFromField<FieldType, Context>
    get?: ITransformFromField<FieldType, Context>
    list?: ITransformFunction<FieldType, Context, InputType>
    write?: ITransformFromFieldWithInput<FieldType, Context, InputType>
    create?: ITransformFunction<FieldType, Context, InputType>
    update?: ITransformFromFieldWithInputAndCurrentValue<FieldType, Context, InputType, ObjectType>
  }
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
