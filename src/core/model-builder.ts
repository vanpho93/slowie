import * as _ from 'lodash'
import { mongoose } from '../mongoose'
import { Document } from 'mongoose'
import { IModel, ModelOf } from './metadata'
import { RootApiGenerator } from './api-generator'
import { Hook } from './hook'
import { TypeGenerator } from './type-generator'

export class ModelBuilder<T, Context> {
  constructor(private model: IModel<Context>) { }

  private _dbModel: any
  public getDbModel(): ModelOf<T, Context> {
    if (_.isNil(this._dbModel)) {
      const schemaDefinition = _.omitBy(
        _.mapValues(this.model.schema, 'db'),
        _.isNil
      )
      this._dbModel = mongoose.model<T & Document>(
        this.model.name,
        new mongoose.Schema(schemaDefinition)
      )

      const predefinedTypes = TypeGenerator.generate(this.model)
      Object.assign(this._dbModel, { hook: new Hook(), predefinedTypes })
    }

    return this._dbModel
  }

  public getGraphqlApis() {
    return RootApiGenerator.generate(
      this.getDbModel(),
      this.model
    )
  }
}
