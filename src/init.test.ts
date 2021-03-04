import * as td from 'testdouble'
import * as mongoose from 'mongoose'
import { TypeGenerator } from './core'

before(() => mongoose.connect(
  process.env.DATABASE_URL as string,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
))

beforeEach(() => {
  td.reset()
  TypeGenerator['_outputTypes'] = {}
})

after(() => mongoose.disconnect())
