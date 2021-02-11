import * as td from 'testdouble'
import * as path from 'path'
import { expect } from 'chai'
import { TestUtils } from '../helpers'
import { ApiLoader } from './api-loader'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#getApis', async () => {
    const folder = path.join(__dirname, 'just-for-test-only')
    const fileA = path.join(folder, 'a.ts')
    const fileB = path.join(folder, 'b.ts')
    const fileC = path.join(folder, 'c.ts')
    const apis = await ApiLoader['getApis']([fileA, fileB, fileC])
    expect(apis).to.deep.equal([1, 2, 3, 4])
  })

  it('#getPaths', () => {
    const testPath = path.join(__dirname, 'just-for-test-only')
    td.replace(ApiLoader, 'MODEL_FOLDER', testPath)
    expect(ApiLoader['getPaths']())
      .to.deep.equal([
        path.join(testPath, 'a.ts'),
        path.join(testPath, 'b.ts'),
        path.join(testPath, 'c.ts'),
      ])
  })
})
