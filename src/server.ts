import * as _ from 'lodash'
import { ApolloServer } from 'apollo-server'
import { ApiLoader, SchemaLoader } from './app-loader'

export async function getServer() {
  const apiGenerators = await ApiLoader.getApis()
  const schema = SchemaLoader.getSchemaFromApiGenerators(apiGenerators)
  return new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = _.get(req, 'headers.authorization', '{ "role": "GUEST" }')
      return JSON.parse(token)
    },
  })
}
