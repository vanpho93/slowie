/* istanbul ignore file */

import * as _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { IUser, IUserCreateInput } from '../../models/user/metadata'
import { app } from '../../app'
import { IReference } from './metadata'

const User = app.getModel<IUser>('User')
const Reference = app.getModel<IReference>('Reference')

User.hook.beforeCreate<IUserCreateInput>(async (context, { referenceCode }) => {
  const presenter = await Reference.findOne({ referenceCode })
  if (_.isNil(presenter)) throw new UserInputError(
    `PRESENTER_NOT_FOUND`
  )
})
