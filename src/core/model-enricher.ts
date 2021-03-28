import { UserInputError } from 'apollo-server'
import * as _ from 'lodash'
import * as mongoose from 'mongoose'
import { Hook } from './hook'
import { IModelDefinition } from './metadata'

export class ModelEnricher<T extends object, Context> {
  constructor(
    private dbModel: mongoose.Model<T & mongoose.Document> &
      { hook: Hook<T, Context> } &
      mongoose.PaginateModel<T & mongoose.Document>,
    private modelDefinition: IModelDefinition<Context>
  ) { }

  withContext(context: Context) {
    return {
      validate: (input: Partial<T>) => this.validate(input, context),
      transform: (input: T) => this.transform(input, context),
      create: (input: T) => this.create(input, context),
      update: (_id: string, input: T) => this.update(_id, input, context),
      remove: (_id: string) => this.remove(_id, context),
      getById: (_id: string) => this.getById(_id, context),
      list: () => this.list(context),
      paginate: (
        query: mongoose.FilterQuery<T & mongoose.Document>,
        options: mongoose.PaginateOptions
      ) => this.paginate(query, options, context),
    }
  }

  async validate(input: Partial<T>, context: Context) {
    for (const key of Object.keys(input)) {
      const validateFunction = _.get(this.modelDefinition.schema[key], 'validate')
      if (validateFunction) await validateFunction(context, input[key], input)
    }
  }

  transform(value: T, context: Context) {
    return _.mapValues(value, (fieldValue, key) => {
      const transformField = _.get(this.modelDefinition.schema[key], 'transform')
      if (!transformField) return fieldValue
      return transformField(context, fieldValue)
    })
  }

  async create(input: Partial<T>, context: Context) {
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

  async update(_id: string, input: Partial<T>, context: Context) {
    await this.validate(input, context)
    const current = await this.dbModel.findById(_id)
    if (_.isNil(current)) throw new UserInputError(
      `${this.modelDefinition.name.toUpperCase()}_NOT_FOUND`
    )

    for (const hook of this.dbModel.hook.beforeUpdateHooks) {
      await hook(context, input, current)
    }

    const result = await this.dbModel.findByIdAndUpdate(_id, input as any, { new: true })
    for (const hook of this.dbModel.hook.afterUpdateHooks) {
      await hook(context, result, input, current)
    }
    return this.transform(result!.toObject(), context)
  }

  async remove(_id: string, context: Context) {
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

  async paginate(
    query: mongoose.FilterQuery<T & mongoose.Document>,
    options: mongoose.PaginateOptions,
    context: Context
  ) {
    const result = await this.dbModel.paginate(query, options)
    return {
      ...result,
      docs: result.docs.map((item) => this.transform(item.toObject(), context)),
    }
  }
}
