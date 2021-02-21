import * as _ from 'lodash'
import { expect } from 'chai'
import { Hook } from './hook'
import { TestUtils } from '../helpers'

describe(TestUtils.getTestTitle(__filename), () => {
  it('all methods works', async () => {
    const hook = new Hook<any, any>()

    hook.beforeCreate(<any> 1)
    hook.afterCreate(<any> 2)
    hook.beforeDelete(<any> 3)
    hook.afterDelete(<any> 4)
    hook.beforeUpdate(<any> 5)
    hook.afterUpdate(<any> 6)

    hook.beforeCreate(<any> 'a')
    hook.afterCreate(<any> 'b')
    hook.beforeDelete(<any> 'c')
    hook.afterDelete(<any> 'd')
    hook.beforeUpdate(<any> 'e')
    hook.afterUpdate(<any> 'f')

    expect(hook).to.deep.include({
      _beforeCreateHooks: [ 1, 'a' ],
      _afterCreateHooks: [ 2, 'b' ],
      _beforeDeleteHooks: [ 3, 'c' ],
      _afterDeleteHooks: [ 4, 'd' ],
      _beforeUpdateHooks: [ 5, 'e' ],
      _afterUpdateHooks: [ 6, 'f' ],
    })
  })
})
