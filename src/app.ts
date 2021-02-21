/* istanbul ignore file */

import * as _ from 'lodash'
import { IRequest, Slowie } from './core'

export enum ERole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export interface IContext {
  userId: string
  role: ERole
}

export const app = new Slowie<IContext>({
  context: (req: IRequest) => {
    const token = _.get(req, 'headers.authorization', '{ "role": "GUEST" }')
    return JSON.parse(token)
  },
})
