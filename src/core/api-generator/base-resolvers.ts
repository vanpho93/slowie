import { ModelOf } from '../metadata'

export const enrichModel = <T, Context>(Model: ModelOf<T, Context>) => {
  return class extends (Model as any) {
    create
  }
}
