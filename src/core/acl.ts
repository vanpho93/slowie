// import * as _ from 'lodash'

// type DefaultInputType<T> = Partial<Omit<T, '_id'>>

// const defaultAcl = () => null

// export class Acl<DefaultType, Context> {
//   onCreateAcl = defaultAcl
//   create<Input = DefaultInputType<DefaultType>>(cb: (context: Context, input: Input) => void | Promise<void>) {
//     const aclAssigned = this.onCreateAcl !== defaultAcl
//     if (aclAssigned) throw new Error('')
//     this.onCreateAcl = <any>cb
//   }

//   update<Input = DefaultInputType<DefaultType>>(cb: (context: Context, input: Input, _id: string) => void | Promise<void>) {
//     this.afterCreateHooks.push(cb)
//   }

//   list<Query>(cb: (context: Context, query: Query) => void | Promise<void>) {
//     this.beforeRemoveHooks.push(cb)
//   }

//   getById(cb: (context: Context, _id: string) => void | Promise<void>) {
//     this.afterRemoveHooks.push(cb)
//   }

//   remove<Current = DefaultType, Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input, current: Current) => void | Promise<void>) {
//     this.beforeUpdateHooks.push(cb)
//   }

//   private setAcl(key: string, cb: Function) {

//   }
// }
