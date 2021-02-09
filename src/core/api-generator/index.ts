import * as _ from 'lodash'
import { GetByIdApiGenerator } from './get-by-id'
import { ListApiGenerator } from './list'
import { RemoveApiGenerator } from './remove'
import { UpdateApiGenerator } from './update'
import { CreateApiGenerator } from './create'
import { Document, Model } from 'mongoose'
import { IModel, IApiGenerator } from '../../core/metadata'

interface BaseApiGeneratorConstructor<T> {
  new(
    dbModel: Model<T & Document, {}>,
    model: IModel
  ): IApiGenerator
}

export const apiGeneratorConstructors: BaseApiGeneratorConstructor<any>[] = [
  GetByIdApiGenerator,
  ListApiGenerator,
  RemoveApiGenerator,
  UpdateApiGenerator,
  CreateApiGenerator,
]

export class ApiGenerator {
  static generate<T>(dbModel: Model<T & Document, {}>, model: IModel) {
    return _.map(
      apiGeneratorConstructors,
      (ApiGenerator: BaseApiGeneratorConstructor<any>) => {
        return new ApiGenerator(dbModel, model)
      })
  }
}
