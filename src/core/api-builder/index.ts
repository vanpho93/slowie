import * as graphql from 'graphql'
import { IApi } from '../metadata'

export interface IApiBuilder {
  build(): IApi
}

export abstract class PaginatedApi<Input> {
  abstract apiName: string
  abstract model: { withContext(context: any): any }

  abstract getOutputType(): graphql.GraphQLObjectType

  abstract getArgs(): graphql.GraphQLFieldConfigArgumentMap

  abstract getQueryObject(input: Input): any

  abstract canAccess(): Promise<void>

  getApi(): graphql.GraphQLFieldConfig<any, any> {
    return {
      type: this.getOutputType(),
      args: {},
      resolve: async (_parent, input: Input, context) => {
        await this.canAccess()
        return this.model.withContext(context).paginate(
          this.getQueryObject(input)
        )
      },
    }
  }
}
