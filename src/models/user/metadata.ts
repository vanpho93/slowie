export interface IUser {
  _id: string
  email: string
  age: string
  password: string
  presenterId: string
}

export interface IUserCreateInput extends Omit<IUser, '_id'> {
  referenceCode: string
}
