import { Schema } from 'mongoose'

export interface IField {
  name: string
}

export interface IModel {
  name: string
  fields: Schema[]
}
