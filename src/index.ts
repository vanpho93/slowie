/* istanbul ignore file */
import { getServer } from './server'

getServer()
  .then(server => server.listen())
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
