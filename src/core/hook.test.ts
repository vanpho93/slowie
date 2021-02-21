import * as _ from 'lodash'
import { expect } from 'chai'
import { Hook } from './hook'
import { TestUtils } from '../helpers'

describe(TestUtils.getTestTitle(__filename), () => {
  it('all methods works', async () => {
    const hook = new Hook<any, any>()

    hook.beforeCreate(<any> 1)
    hook.afterCreate(<any> 2)
    hook.beforeRemove(<any> 3)
    hook.afterRemove(<any> 4)
    hook.beforeUpdate(<any> 5)
    hook.afterUpdate(<any> 6)

    hook.beforeCreate(<any> 'a')
    hook.afterCreate(<any> 'b')
    hook.beforeRemove(<any> 'c')
    hook.afterRemove(<any> 'd')
    hook.beforeUpdate(<any> 'e')
    hook.afterUpdate(<any> 'f')

    expect(hook).to.deep.include({
      beforeCreateHooks: [ 1, 'a' ],
      afterCreateHooks: [ 2, 'b' ],
      beforeRemoveHooks: [ 3, 'c' ],
      afterRemoveHooks: [ 4, 'd' ],
      beforeUpdateHooks: [ 5, 'e' ],
      afterUpdateHooks: [ 6, 'f' ],
    })
  })
})
