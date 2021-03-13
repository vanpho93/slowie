import * as graphql from 'graphql'
import * as _ from 'lodash'
import { customAlphabet } from 'nanoid'

interface IQueryField {
  field: string,
  type: graphql.GraphQLScalarType
  operators: string[]
  required?: boolean
}

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8)

export class QueryInputTypeBuilder {
  private queryFields: IQueryField[] = []

  build() {
    const required = _.some(this.queryFields, 'required')
    const type = new graphql.GraphQLInputObjectType({
      name: `GeneratedQueryType_${nanoid()}`,
      fields: this.getFields(),
    })
    if (required) return { type: graphql.GraphQLNonNull(type) }
    return { type }
  }

  addQueryField(queryField: IQueryField) {
    this.queryFields.push(queryField)
    return this
  }

  private getFields() {
    return _.chain(this.queryFields)
      .groupBy('field')
      .mapValues(fields => {
        const type = this.getInputTypeByFields(fields)
        if (_.some(fields, 'required')) return ({ type: graphql.GraphQLNonNull(type) })
        return { type }
      })
      .value()
  }

  private getInputTypeByFields(queryFields: IQueryField[]): graphql.GraphQLInputObjectType {
    const { type, field } = _.first(queryFields)!
    const operatorConfigs = {
      eq: type,
      gte: type,
      lte: type,
      in: graphql.GraphQLList(type),
      exists: graphql.GraphQLBoolean,
    }

    const fields = _.chain(queryFields)
      .map(({ operators, required }) => operators.map(operator => ({ operator, required })))
      .flatMap()
      .map(({ operator, required }) => {
        const operatorType = operatorConfigs[operator]
        return { [operator]: { type: required ? graphql.GraphQLNonNull(operatorType) : operatorType } }
      })
      .reduce((a, b) => ({ ...a, ...b }))
      .value()

    return new graphql.GraphQLInputObjectType({
      name: `QueryQueryTypeForField${_.capitalize(field)}_${nanoid()}`,
      fields,
    })
  }
}
