import * as _ from 'lodash'
import * as graphql from 'graphql'
import {
  IModel,
  EFieldAction,
  IPredefinedTypes,
} from '../core/metadata'

export class TypeGenerator {
  constructor(protected model: IModel<any>) { }

  private getFields(fieldAction: EFieldAction): _.Dictionary<graphql.GraphQLFieldConfig<any, any>> {
    const filterOption = fieldAction === EFieldAction.READ ? { hideFromReadApis: true } : { hideFromWriteApis: true }
    const hiddenFields = _.chain(this.model.schema)
      .map((value, key) => ({ key, ...value }))
      .filter(filterOption)
      .map('key')
      .value()

    return _.chain(this.model.schema).omit(hiddenFields).mapValues('graphql').value()
  }

  private getOutputType(): graphql.GraphQLObjectType {
    return new graphql.GraphQLObjectType({
      name: this.model.name,
      fields: this.getFields(EFieldAction.READ),
    })
  }

  private getCreateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.model.name}CreateInput`,
      fields: _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }

  private getUpdateInputType() {
    return new graphql.GraphQLInputObjectType(<any>{
      name: `${this.model.name}UpdateInput`,
      fields: _.omit(this.getFields(EFieldAction.WRITE), '_id'),
    })
  }

  private generate() {
    return {
      OUTPUT: this.getOutputType(),
      CREATE_INPUT: this.getCreateInputType(),
      UPDATE_INPUT: this.getUpdateInputType(),
    }
  }

  static generate(model: IModel<any>): IPredefinedTypes {
    return new TypeGenerator(model).generate()
  }
}
