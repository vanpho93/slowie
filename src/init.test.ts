import { BaseApiGenerator } from './core/api-generator/base-api-generator'
import * as td from 'testdouble'
import { mongoose } from './mongoose'

beforeEach(() => {
  td.reset()
  BaseApiGenerator['_types'] = {}
})

after(() => mongoose.disconnect())
