import * as graphql from 'graphql'
import * as _ from 'lodash'

interface IQueryField {
  field: string,
  type: graphql.GraphQLScalarType
  operators: string[]
  required?: boolean
}

const sortDirection = new graphql.GraphQLEnumType({
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

  setName(name: string) {
    this.name = name
    return this
  }

  build(): graphql.GraphQLFieldConfigArgumentMap {
    return _.omitBy(
      {
        offset: { type: graphql.GraphQLInt, defaultValue: 0 },
        limit: { type: graphql.GraphQLInt, defaultValue: 10 },
        where: this.getWhere(),
        sort: this.getSort(),
      },
      _.isNil
    ) as any
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

  getSort() {
    if (_.isEmpty(this.sortableFields)) return null
    const type = new graphql.GraphQLInputObjectType({
      name: `${this.name}Sort`,
      fields: {
        email: { type: sortDirection },
      },
    })
    return { type }
  }

  addSortableFields(fields: string[]) {
    this.sortableFields = _.uniq([...fields, ...this.sortableFields])
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
      .reduce((a, b) => ({ ...a, ...b }))
      .value()

    return new graphql.GraphQLInputObjectType({
      name: `${this.name}QueryFor${_.capitalize(field)}`,
      fields,
    })
  }
}
