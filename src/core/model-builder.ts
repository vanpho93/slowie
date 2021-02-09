import * as _ from 'lodash'
import { Document, Model } from 'mongoose'
import { IModel } from './metadata'
import { mongoose } from '../mongoose'
import { ApiGenerator } from './api-generator'

export class ModelBuilder<T> {
  constructor(private model: IModel) { }

  private _dbModel: any
  public getDbModel(): Model<T & Document, {}> {
    if (_.isNil(this._dbModel)) {
      const schemaDefinition = _.mapValues(this.model.schema, 'db')
      this._dbModel = mongoose.model<T & Document>(
        this.model.name,
        new mongoose.Schema(schemaDefinition)
      )
    }
    return this._dbModel
  }

  public getGraphqlApis() {
    return ApiGenerator.generate(
      this.getDbModel(),
      this.model
    )
  }
}
