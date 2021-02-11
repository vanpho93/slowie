import * as path from 'path'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { ApiLoader } from './api-loader'

describe(TestUtils.getTestTitle(__filename), () => {
  describe('#getApis', () => {
    it('Can get apis', async () => {
      const folder = path.join(__dirname, 'just-for-test-only')
      const fileA = path.join(folder, 'a.ts')
      const fileB = path.join(folder, 'b.ts')
      const fileC = path.join(folder, 'c.ts')
      const apis = await ApiLoader.getApis([fileA, fileB, fileC])
      expect(apis).to.deep.equal([1, 2, 3, 4])
    })
  })
})
