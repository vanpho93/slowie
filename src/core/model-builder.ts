import * as _ from 'lodash'
import { Document } from 'mongoose'
import { IModel, ModelOf } from './metadata'
import { mongoose } from '../mongoose'
import { RootApiGenerator } from './api-generator'
import { Hook } from './hook'

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

      Object.assign(this._dbModel, { hook: new Hook() })
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
