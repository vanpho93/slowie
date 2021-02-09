export class Value {
  // tslint:disable-next-line: no-any
  static get NO_MATTER(): any {
    return Math.random()
  }

  static get SOME_STRING(): string {
    return String(Math.random())
  }

  // tslint:disable-next-line: no-any
  static get NO_MATTER_OBJECT(): any {
    return {}
  }

  // tslint:disable-next-line: no-any
  static get SOME_VALUE(): any {
    return Math.random()
  }

  // tslint:disable-next-line: no-any
  static get SOME_NUMBER(): any {
    return Math.random()
  }

  // tslint:disable-next-line: no-any
  static get SOME_OBJECT(): any {
    return { data: Math.random() }
  }

  // tslint:disable-next-line: no-any
  static wrap(input: any): any {
    return input
  }

  // tslint:disable-next-line: no-any
  static get EMPTY_ARRAY(): any[] {
    return []
  }
}
