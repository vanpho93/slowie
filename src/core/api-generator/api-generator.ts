import * as _ from 'lodash'
import { GetByIdApiGenerator } from './get-by-id'
import { ListApiGenerator } from './list'
import { RemoveApiGenerator } from './remove'
import { UpdateApiGenerator } from './update'
import { CreateApiGenerator } from './create'
import { Document, Model } from 'mongoose'
import { IModel, IApiGenerator } from '../metadata'

interface IBaseApiGeneratorConstructor<T> {
  new(
    dbModel: Model<T & Document, {}>,
    model: IModel
  ): IApiGenerator
}

export class ApiGenerator {
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
