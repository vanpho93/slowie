// import { join, basename } from 'path'
// import { readdirSync, lstatSync } from 'fs'
// import { IRoute } from '../global'
// import { map } from 'lodash'

// export class RouteFinder {
//   static getPaths() {
//     const result: string[] = []

//     const scanFolder = (filePath = join(__dirname, '..', 'apis')) => {
//       const children = readdirSync(filePath)
//       children.forEach(child => {
//         const path = join(filePath, child)
//         if (lstatSync(path).isDirectory()) return scanFolder(path)
//         const isRouteFile = ['route.ts', 'route.js'].includes(basename(path))
//         if (!isRouteFile) return
//         result.push(path)
//       })
//     }
//     scanFolder()
//     return result
//   }

//   static async find(): Promise<IRoute[]> {
//     const paths = this.getPaths()
//     const routesModules = await Promise.all(paths.map(path => import(path)))
//     return map(routesModules, mod => new mod.Route())
//   }
// }
