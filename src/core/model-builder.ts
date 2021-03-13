import * as _ from 'lodash'
import * as mongoose from 'mongoose'
import { IModelDefinition, ModelOf } from './metadata'
import { RootApiGenerator } from './api-generator'
import { Hook } from './hook'
import { TypeGenerator } from './type-generator'
import { ModelEnricher } from './model-enricher'
import * as mongoosePaginate from 'mongoose-paginate-v2'

export class ModelBuilder<T extends object, Context> {
  constructor(private modelDefinition: IModelDefinition<Context>) { }

  private _dbModel: any
  public getDbModel(): ModelOf<T, Context> {
    if (!_.isNil(this._dbModel)) return this._dbModel
    const schemaDefinition = _.omitBy(
      _.mapValues(this.modelDefinition.schema, 'db'),
      _.isNil
    )
    const schema = new mongoose.Schema(
      schemaDefinition,
      { timestamps: !this.modelDefinition.skipTimestamp }
    )
    schema.plugin(mongoosePaginate)

    this._dbModel = mongoose.model<T & mongoose.Document>(
      this.modelDefinition.name,
      schema
    )

    const predefinedTypes = TypeGenerator.generate(this.modelDefinition)
    const enricher = new ModelEnricher(this._dbModel, this.modelDefinition)
    Object.assign(
      this._dbModel,
      {
        hook: new Hook(),
        predefinedTypes,
        withContext: enricher.withContext.bind(enricher),
      }
    )
    return this._dbModel
  }

  public getGraphqlApis() {
    return RootApiGenerator.generate(
      this.getDbModel(),
      this.modelDefinition
    )
  }
}
