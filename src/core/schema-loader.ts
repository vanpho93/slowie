import * as graphql from 'graphql'
import * as _ from 'lodash'
import { EApiType, IApiGenerator } from './metadata'

export class SchemaLoader {
  public static getSchemaFromApiGenerators(apiGenerators: IApiGenerator[]) {
    const query = new graphql.GraphQLObjectType({
      name: 'Query',
      fields: this.getFieldsByApiType(apiGenerators, EApiType.QUERY),
    })

    const mutation = new graphql.GraphQLObjectType({
      name: 'Mutation',
      fields: this.getFieldsByApiType(apiGenerators, EApiType.MUTATION),
    })

    return new graphql.GraphQLSchema({
      query,
      mutation,
    })
  }

  private static getFieldsByApiType(apiGenerators: IApiGenerator[], apiType: EApiType) {
    return _.chain(apiGenerators)
      .filter({ type: apiType })
      .map(generator => generator.generate())
      .reduce(_.merge)
      .value()
  }
}
