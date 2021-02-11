import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'

export class ApiLoader {
  private static async getApis(paths: string[]) {
    const importedObjects = await Promise.all(_.map(paths, path => import(path)))
    return _.chain(importedObjects)
      .map('apis')
      .compact()
      .reduce((a, b) => _.concat(a, b))
      .value()
  }

  private static MODEL_FOLDER = path.join('..', 'models')

  private static getPaths() {
    return fs.readdirSync(this.MODEL_FOLDER)
      .map(file => path.join(this.MODEL_FOLDER, file))
  }
}
