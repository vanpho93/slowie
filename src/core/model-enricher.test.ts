import * as _ from 'lodash'
import * as td from 'testdouble'
import { expect } from 'chai'
import { AuthenticationError, UserInputError } from 'apollo-server'
import { TestUtils } from '../helpers'
import { ModelEnricher } from './model-enricher'

describe(TestUtils.getTestTitle(__filename), () => {
  it('#create', async () => {
    const beforeCreateHook = td.function()
    const afterCreateHook = td.function()

    const enricher = new ModelEnricher(<any>{}, <any>{ name: 'User' })
    td.replace(enricher, 'transform', (context, value) => _.merge(context, value))
    td.replace(enricher, 'validate', _.identity)

    td.replace(enricher, 'dbModel', {
      create(input: {}) {
        return { toObject() { return _.merge({ _id: 'some_id' }, input) } }
      },
      hook: {
        beforeCreateHooks: [beforeCreateHook],
        afterCreateHooks: [afterCreateHook],
      },
    })

    const context = <any>{ role: 'ADMIN' }
    const input = { name: 'Brian' }

    const output = await enricher.withContext(context).create(input)

    expect(output)
      .to.deep
      .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })

    const created = { toObject: td.matchers.anything() }
    td.verify(beforeCreateHook(context, input))
    td.verify(afterCreateHook(context, created, input))
  })

  describe('#update', () => {
    let enricher: ModelEnricher<{}, {}>

    beforeEach(() => {
      enricher = new ModelEnricher(<any>{}, <any>{ name: 'User' })
      td.replace(enricher, 'transform', (context, value) => _.merge(context, value))
      td.replace(enricher, 'validate', _.identity)
    })

    it('update successfully', async () => {
      const beforeUpdateHook = td.function()
      const afterUpdateHook = td.function()

      td.replace(enricher, 'dbModel', {
        findById(_id: string, input: {}) {
          return { toObject() { return _.merge({ _id }, input) }, toBeUpdated: true }
        },
        findByIdAndUpdate(_id: string, input: {}) {
          return { toObject() { return _.merge({ _id }, input) }, updated: true }
        },
        hook: {
          beforeUpdateHooks: [beforeUpdateHook],
          afterUpdateHooks: [afterUpdateHook],
        },
      })

      const context = <any> { role: 'ADMIN' }
      const input = { name: 'Brian' }
      const output = await enricher.withContext(context)['update'](
        'some_id',
        input
      )

      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })

      const toBeUpdatedObject = { toObject: td.matchers.anything(), toBeUpdated: true }
      const updatedObject = { toObject: td.matchers.anything(), updated: true }
      td.verify(beforeUpdateHook(context, input, toBeUpdatedObject))
      td.verify(afterUpdateHook(context, updatedObject, input))
    })

    it('not found', async () => {
      td.replace(enricher, 'dbModel', {
        findById(_id: string, input: {}) {
          return null
        },
      })

      const output: UserInputError = await enricher.withContext(context)['update'](
        TestUtils.NO_MATTER_VALUE('id'),
        TestUtils.NO_MATTER_VALUE('input')
      ).catch(error => error)
      expect(output).to.be.an.instanceOf(UserInputError)
      expect(output.message).to.equal('USER_NOT_FOUND')
    })
  })

  it('#transform', () => {
    const enricher = new (<any> ModelEnricher)(
      TestUtils.NO_MATTER_VALUE('DbModel'),
      <any> {
        schema: {
          shouldRemain: {},
          shouldChange: {
            transform: ({ role }, value: string) => {
              if (role === 'GUEST') return 'abcd'
              return value
            },
          },
        },
      }
    )

    const value = {
      shouldRemain: 'constant',
      shouldChange: 'change_to_abcd_if_role_is_guest',
    }

    expect(
      enricher.withContext(<any>{ role: 'GUEST' })['transform'](value)
    ).to.deep.equal({ shouldRemain: 'constant', shouldChange: 'abcd' })

    expect(
      enricher.withContext(<any>{ role: 'ADMIN' })['transform'](value)
    ).to.deep.equal(value)
  })

  it('#validate', async () => {
    const enricher = new (<any> ModelEnricher)(
      TestUtils.NO_MATTER_VALUE('DbModel'),
      <any> {
        schema: {
          shouldSkip: {},
          shouldCheck: {
            validate: ({ role }, value: string) => {
              if (role !== 'ADMIN') throw new AuthenticationError('ONLY_ADMIN')
              if (value === 'invalid')throw new UserInputError('INVALID_VALUE')
            },
          },
        },
      }
    )

    const authError = await enricher.withContext({ role: 'GUEST' })['validate']({ shouldCheck: 'some_value' }).catch(error => error)
    expect(authError.message).to.equal('ONLY_ADMIN')

    const fieldError = await enricher.withContext({ role: 'ADMIN' })['validate']({ shouldCheck: 'invalid' }).catch(error => error)
    expect(fieldError.message).to.equal('INVALID_VALUE')

    enricher.withContext({ role: 'ADMIN' })['validate']({
      shouldSkip: 'nothing',
      shouldCheck: 'valid',
    })
  })

  it('#list', async () => {
    const enricher = new ModelEnricher(<any>{}, <any>{ name: 'User' })
    td.replace(enricher, 'transform', (context, value) => ({ ...context, ...value }))
    td.replace(enricher, 'dbModel', {
      find() {
        return [
          { toObject() { return { _id: 'a', name: 'a' } } },
          { toObject() { return { _id: 'b', name: 'b' } } },
        ]
      },
    })

    const output = await enricher['list']({ role: 'ADMIN' })

    expect(output)
      .to.deep
      .equal([
        { _id: 'a', name: 'a', role: 'ADMIN' },
        { _id: 'b', name: 'b', role: 'ADMIN' },
      ])
  })

  describe('#getById', () => {
    let enricher: ModelEnricher<any, any>

    beforeEach(() => {
      enricher = new ModelEnricher(<any>{}, <any>{ name: 'User' })
      td.replace(enricher, 'transform', (context, value) => _.merge(context, value))
    })

    it('get successfully', async () => {
      td.replace(enricher, 'dbModel', {
        findById(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } } }
        },
      })

      const output = await enricher.withContext({ role: 'ADMIN' })['getById']('some_id')
      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })
    })

    it('not found', async () => {
      td.replace(enricher, 'dbModel', {
        findById(_id: string) { return null },
      })

      const output: UserInputError = await enricher['getById'](
        TestUtils.NO_MATTER_VALUE('id'),
        TestUtils.NO_MATTER_VALUE('context')
      ).catch(error => error)
      expect(output).to.be.an.instanceOf(UserInputError)
      expect(output.message).to.equal('USER_NOT_FOUND')
    })
  })

  describe('#remove', () => {
    let enricher: ModelEnricher<any, any>

    beforeEach(() => {
      enricher = new ModelEnricher(<any>{}, <any>{ name: 'User' })
      td.replace(enricher, 'transform', (context, value) => _.merge(context, value))
    })

    it('remove successfully', async () => {
      const beforeRemoveHook = td.function()
      const afterRemoveHook = td.function()

      td.replace(enricher, 'dbModel', {
        findById(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } }, toBeRemoved: true }
        },
        findByIdAndDelete(_id: string) {
          return { toObject() { return { _id, name: 'Brian' } }, removed: true }
        },
        hook: {
          beforeRemoveHooks: [beforeRemoveHook],
          afterRemoveHooks: [afterRemoveHook],
        },
      })

      const context = <any> { role: 'ADMIN' }
      const output = await enricher.withContext(context)['remove']('some_id')
      expect(output)
        .to.deep
        .equal({ _id: 'some_id', name: 'Brian', role: 'ADMIN' })

      const toBeRemovedObject = { toObject: td.matchers.anything(), toBeRemoved: true }
      const removedObject = { toObject: td.matchers.anything(), removed: true }
      td.verify(beforeRemoveHook(context, toBeRemovedObject))
      td.verify(afterRemoveHook(context, removedObject))
    })

    it('not found', async () => {
      td.replace(enricher, 'dbModel', {
        findById(_id: string) { return null },
      })

      const output: UserInputError = await enricher.withContext('context')['remove']('id').catch(error => error)
      expect(output).to.be.an.instanceOf(UserInputError)
      expect(output.message).to.equal('USER_NOT_FOUND')
    })
  })
})