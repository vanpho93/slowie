import * as express from 'express'

export interface ISlowieInput {
  modelDirectory: string
  port?: number | string
  onReady?: () => void
}

export class Slowie {
  public app = express()

  static init(input: ISlowieInput) {
    const instance = new Slowie(input)
    return instance
  }

  private start() {
    this.app.listen(this.input.port, this.input.onReady)
  }

  constructor(private input: ISlowieInput) {
    this.load()
  }

  private load() {
    const routes = this.getRoutes()
    for (const route of routes) this.app.use(route)
  }

  private getRoutes(): express.Router[] {
    return []
  }
}
