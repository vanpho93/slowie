import * as path from 'path'
import * as td from 'testdouble'
import * as fs from 'fs'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { ApiLoader } from './api-loader'

describe(TestUtils.getTestTitle(__filename), () => {
  describe('#getApis', () => {
    it('Can get apis', async () => {
      const fileA = path.join(__dirname, 'just-for-test-a.ts')
      const fileB = path.join(__dirname, 'just-for-test-b.ts')
      const fileC = path.join(__dirname, 'just-for-test-c.ts')
      const apis = await ApiLoader.getApis([fileA, fileB, fileC])
      expect(apis).to.deep.equal([1, 2, 3, 4])
    })
  })
})
