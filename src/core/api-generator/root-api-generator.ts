import * as _ from 'lodash'
import { ApiGenerator as GetByIdApiGenerator } from './get-by-id/api-generator'
import { ApiGenerator as ListApiGenerator } from './list/api-generator'
import { ApiGenerator as RemoveApiGenerator } from './remove/api-generator'
import { ApiGenerator as UpdateApiGenerator } from './update/api-generator'
import { ApiGenerator as CreateApiGenerator } from './create/api-generator'
import { Document, Model } from 'mongoose'
import { IModelDefinition, IApiGenerator } from '../metadata'

interface IBaseApiGeneratorConstructor<T> {
  new(
    dbModel: Model<T & Document, {}>,
    model: IModelDefinition<any>
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

  static generate<T>(dbModel: Model<T & Document, {}>, modelDefinition: IModelDefinition<any>) {
    return _.chain(this.apiGeneratorConstructors)
      .map((ApiGenerator) => new ApiGenerator(dbModel, modelDefinition))
      .filter(generator => !_.includes(modelDefinition.hideDefaultApis, generator.defaultApiType))
      .value()
  }
}
