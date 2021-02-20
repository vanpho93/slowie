import * as _ from 'lodash'
import { ApolloServer } from 'apollo-server'
import { IModel } from './metadata'
import { ModelBuilder } from './model-builder'
import { SchemaLoader } from '../app-loader'

export type IRequest = { headers: { [key: string]: string } }

export type GetContextFunction<Context> = (req: IRequest) => Promise<Context>

export class Slowie<Context> {
  private _models: _.Dictionary<any> = {}
  private _apis: any[] = []

  constructor(private config: { context: GetContextFunction<Context> }) {}

  createModel(modelDefinition: IModel) {
    const builder = new ModelBuilder(modelDefinition)
    this._models[modelDefinition.name] = builder.getDbModel()
    this._apis.push(...builder.getGraphqlApis())
  }

  start(...opts: Array<any>) {
    const schema = SchemaLoader.getSchemaFromApiGenerators(this._apis)
    return new ApolloServer({
      schema,
      context: ({ req }) => this.config.context(req),
    }).listen(...opts)
  }
}
