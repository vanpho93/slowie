/* istanbul ignore file */
import './models/user/model'
import './models/reference/model'

import { app } from './app'

app
  .getServer()
  .listen()
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
