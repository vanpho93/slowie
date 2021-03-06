import * as _ from 'lodash'
import * as mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server'
import { IModelDefinition, ModelOf } from './metadata'
import { ModelBuilder } from './model-builder'
import { SchemaLoader } from './schema-loader'

export type IRequest = { headers: { [key: string]: string } }

export type GetContextFunction<Context> = (req: IRequest) => Promise<Context>

export class Slowie<Context> {
  private _models: _.Dictionary<any> = {}
  private _apis: any[] = []

  constructor(private config: { context: GetContextFunction<Context> }) {}

  createModel<T extends object>(modelDefinition: IModelDefinition<Context>): ModelOf<T, Context> {
    const builder = new ModelBuilder(modelDefinition)
    this._models[modelDefinition.name] = builder.getDbModel()
    this._apis.push(...builder.getGraphqlApis())
    return this._models[modelDefinition.name]
  }

  getModel<T extends object>(name: string): ModelOf<T, Context> {
    if (_.isNil(this._models[name])) throw new Error(`Model ${name} not found.`)
    return this._models[name]
  }

  getServer() {
    const schema = SchemaLoader.getSchemaFromApiGenerators(this._apis)
    return new ApolloServer({
      schema,
      context: ({ req }) => this.config.context(req),
    })
  }

  readonly mongoose = mongoose
}
