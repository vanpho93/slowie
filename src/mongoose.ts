import * as mg from 'mongoose'

mg.connect(
  process.env.DATABASE_URL as string,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
)

export const mongoose = mg
