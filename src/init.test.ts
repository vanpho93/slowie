import { BaseApiGenerator } from './core/api-generator/base-api-generator'
import * as td from 'testdouble'

beforeEach(() => {
  td.reset()
  BaseApiGenerator['_types'] = {}
})
