import * as td from 'testdouble'
import { mongoose } from './mongoose'
import { TypeGenerator } from './core'

beforeEach(() => {
  td.reset()
  TypeGenerator['_outputTypes'] = {}
})

after(() => mongoose.disconnect())
