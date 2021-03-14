import * as graphql from 'graphql'
import * as _ from 'lodash'

interface IQueryField {
  field: string,
  type: graphql.GraphQLScalarType
  operators: string[]
  required?: boolean
}

export const sortDirection = new graphql.GraphQLEnumType({
  name: 'SortDirection',
  values: {
    asc: { value: 'asc' },
    desc: { value: 'desc' },
  },
})

export class PaginateApiArgsBuilder {
  private queryFields: IQueryField[] = []
  private name = 'UNKNOWN_TYPE'
  private sortableFields: string[] = []
  private defaultLimit = 10

  setName(name: string) {
    this.name = name
    return this
  }

  build(): graphql.GraphQLFieldConfigArgumentMap {
    return _.omitBy(
      {
        offset: { type: graphql.GraphQLInt, defaultValue: 0 },
        limit: { type: graphql.GraphQLInt, defaultValue: this.defaultLimit },
        where: this.getWhere(),
        sort: this.getSort(),
      },
      _.isNil
    ) as any
  }

  setDefaultLimit(limit: number) {
    this.defaultLimit = limit
    return this
  }

  getWhere() {
    if (_.isEmpty(this.queryFields)) return null
    const required = _.some(this.queryFields, 'required')
    const type = new graphql.GraphQLInputObjectType({
      name: `${this.name}Where`,
      fields: this.getFields(),
    })
    if (required) return { type: graphql.GraphQLNonNull(type) }
    return { type }
  }

  private getSort() {
    if (_.isEmpty(this.sortableFields)) return null
    const fields = this.sortableFields
      .map(field => ({ [field]: { type: sortDirection } }))
      .reduce(_.merge)
    const type = new graphql.GraphQLInputObjectType({
      name: `${this.name}Sort`,
      fields: fields,
    })
    return { type }
  }

  addSortableFields(fields: string[]) {
    this.sortableFields = _.uniq([...this.sortableFields, ...fields])
    return this
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
      .reduce(_.merge)
      .value()

    return new graphql.GraphQLInputObjectType({
      name: `${this.name}QueryFor${_.capitalize(field)}`,
      fields,
    })
  }
}
