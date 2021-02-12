import * as _ from 'lodash'
import { ApiGenerator as GetByIdApiGenerator } from './get-by-id/api-generator'
import { ApiGenerator as ListApiGenerator } from './list/api-generator'
import { ApiGenerator as RemoveApiGenerator } from './remove/api-generator'
import { ApiGenerator as UpdateApiGenerator } from './update/api-generator'
import { ApiGenerator as CreateApiGenerator } from './create/api-generator'
import { Document, Model } from 'mongoose'
import { IModel, IApiGenerator } from '../metadata'

interface IBaseApiGeneratorConstructor<T> {
  new(
    dbModel: Model<T & Document, {}>,
    model: IModel
  ): IApiGenerator
}

export class RootApiGenerator {
  static apiGeneratorConstructors: IBaseApiGeneratorConstructor<any>[] = [
    GetByIdApiGenerator,
    ListApiGenerator,
    RemoveApiGenerator,
    UpdateApiGenerator,
    CreateApiGenerator,
  ]

  static generate<T>(dbModel: Model<T & Document, {}>, model: IModel) {
    return _.map(
      this.apiGeneratorConstructors,
      (ApiGenerator: IBaseApiGeneratorConstructor<any>) => {
        return new ApiGenerator(dbModel, model)
      })
  }
}