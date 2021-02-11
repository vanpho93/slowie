import * as _ from 'lodash'

export class ApiLoader {
  static async getApis(paths: string[]) {
    const importedObjects = await Promise.all(_.map(paths, path => import(path)))
    return _.chain(importedObjects)
      .map('apis')
      .compact()
      .reduce((a, b) => _.concat(a, b))
      .value()
  }
}
