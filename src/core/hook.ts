export class Hook<Context, DefaultType> {
  private _beforeCreateHooks: Function[] = []
  private _afterCreateHooks: Function[] = []

  private _beforeDeleteHooks: Function[] = []
  private _afterDeleteHooks: Function[] = []

  private _beforeUpdateHooks: Function[] = []
  private _afterUpdateHooks: Function[] = []

  beforeCreate<Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input) => void | Promise<void>) {
    this._beforeCreateHooks.push(cb)
  }

  afterCreate<Input = Partial<Omit<DefaultType, '_id'>>, Created = DefaultType>(cb: (context: Context, input: Input, created: Created) => void | Promise<void>) {
    this._afterCreateHooks.push(cb)
  }

  beforeDelete<ToBeDeleted = DefaultType>(cb: (context: Context, toBeDeleted: ToBeDeleted) => void | Promise<void>) {
    this._beforeDeleteHooks.push(cb)
  }

  afterDelete<Deleted = DefaultType>(cb: (context: Context, deleted: Deleted) => void | Promise<void>) {
    this._afterDeleteHooks.push(cb)
  }

  beforeUpdate<Current = DefaultType, Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input, current: Current) => void | Promise<void>) {
    this._beforeUpdateHooks.push(cb)
  }

  afterUpdate<Updated, Input = Partial<Omit<DefaultType, '_id'>>>(cb: (context: Context, input: Input, updated: Updated) => void | Promise<void>) {
    this._afterUpdateHooks.push(cb)
  }
}
