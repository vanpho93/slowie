import { UserInputError } from 'apollo-server'
import * as _ from 'lodash'
import * as mongoose from 'mongoose'
import { Hook } from './hook'
import { IModelDefinition, ModelOf } from './metadata'

export class ModelEnricher<T extends object, Context> {
  constructor(
    private dbModel: mongoose.Model<T & mongoose.Document> & { hook: Hook<T, Context> },
    private modelDefinition: IModelDefinition<Context>
  ) { }

  enrich<T, Context>(): ModelOf<T, Context> {
    const methods = [
      'validate',
      'transform',
      'create',
      'update',
      'delete',
      'getById',
      'list',
    ]
    const withContext = _.chain(this)
      .pick(methods)
      .mapKeys(fn => (<any>fn).bind(this))
      .value()
    return Object.assign(this.dbModel, withContext) as any
  }

  async validate(input: T, context: Context) {
    for (const key of Object.keys(input)) {
      const validateFunction = _.get(this.modelDefinition.schema[key], 'validate')
      if (validateFunction) await validateFunction(context, input)
    }
  }

  transform(value: T, context: Context) {
    return _.mapValues(value, (fieldValue, key) => {
      const transformField = _.get(this.modelDefinition.schema[key], 'transform')
      if (!transformField) return fieldValue
      return transformField(context, fieldValue)
    })
  }

  async create(input: T, context: Context) {
    await this.validate(input, context)
    for (const hook of this.dbModel.hook.beforeCreateHooks) {
      await hook(context, input)
    }

    const result = await this.dbModel.create(<any>input)

    for (const hook of this.dbModel.hook.afterCreateHooks) {
      await hook(context, result, input)
    }
    return this.transform(result.toObject(), context)
  }

  async update(_id: string, input: T, context: Context) {
    await this.validate(input, context)
    const current = await this.dbModel.findById(_id)
    if (_.isNil(current)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )

    for (const hook of this.dbModel.hook.beforeUpdateHooks) {
      await hook(context, input, current)
    }

    const result = await this.dbModel.findByIdAndUpdate(_id, input, { new: true })
    for (const hook of this.dbModel.hook.afterUpdateHooks) {
      await hook(context, result, input)
    }
    return this.transform(result!.toObject(), context)
  }

  async delete(_id: string, context: Context) {
    const toBeRemoved = await this.dbModel.findById(_id)
    if (_.isNil(toBeRemoved)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )
    for (const hook of this.dbModel.hook.beforeRemoveHooks) {
      await hook(context, toBeRemoved)
    }

    const result = await this.dbModel.findByIdAndDelete(_id)

    for (const hook of this.dbModel.hook.afterRemoveHooks) {
      await hook(context, result)
    }
    return this.transform(result!.toObject(), context)
  }

  async getById(_id: string, context: Context) {
    const result = await this.dbModel.findById(_id)
    if (_.isNil(result)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )
    return this.transform(result.toObject(), context)
  }

  async list(context: Context) {
    const items = await this.dbModel.find({})
    return items.map((item) => this.transform(item.toObject(), context))
  }
}
