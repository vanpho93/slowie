import * as mg from 'mongoose'

mg.connect('mongodb://localhost:27017/slowie', { useNewUrlParser: true, useUnifiedTopology: true })

export const mongoose = mg
