export interface ISlowieInput {
  modelDirectory: string
  port?: number | string
  onReady?: () => void
}

export class Slowie {
  static init(input: ISlowieInput) {
    const instance = new Slowie(input)
    return instance
  }

  private start() {
    if (this.input.onReady) this.input.onReady()
  }

  constructor(private input: ISlowieInput) {
    this.load()
  }

  private load() {
    console.log('Slowie is loading')
    console.log('Slowie loaded')
    this.start()
  }
}
