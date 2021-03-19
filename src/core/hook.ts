export class Hook<DefaultType, Context> {
  public beforeCreateHooks: Function[] = []
  public afterCreateHooks: Function[] = []

  public beforeRemoveHooks: Function[] = []
  public afterRemoveHooks: Function[] = []

  public beforeUpdateHooks: Function[] = []
  public afterUpdateHooks: Function[] = []

  beforeCreate<Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input) => void | Promise<void>) {
    this.beforeCreateHooks.push(cb)
  }

  afterCreate<Input = Partial<Omit<DefaultType, '_id'>>, Created = DefaultType>(cb: (context: Context, created: Created, input: Input) => void | Promise<void>) {
    this.afterCreateHooks.push(cb)
  }

  beforeRemove<ToBeRemoved = DefaultType>(cb: (context: Context, toBeRemoved: ToBeRemoved) => void | Promise<void>) {
    this.beforeRemoveHooks.push(cb)
  }

  afterRemove<Removed = DefaultType>(cb: (context: Context, removed: Removed) => void | Promise<void>) {
    this.afterRemoveHooks.push(cb)
  }

  beforeUpdate<Current = DefaultType, Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input, current: Current) => void | Promise<void>) {
    this.beforeUpdateHooks.push(cb)
  }

  afterUpdate<Updated = DefaultType, Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, updated: Updated, input: Input) => void | Promise<void>) {
    this.afterUpdateHooks.push(cb)
  }
}
