import { IModel } from './metadata'

export class ModelBuilder {
  static build() {
    return {}
  }
}

export class DatabaseModelCreator {
  static create(model: IModel) {}
}

export class APICreator {
  static create(model: IModel) {}
}

export class InterfaceCreator {
  static create(model: IModel) {}
}

export class APIDocsGenerator {
  static create(model: IModel) {}
}
