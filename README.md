[![CircleCI](https://circleci.com/gh/vanpho93/slowie.svg?style=svg)](https://circleci.com/gh/vanpho93/slowie) [![Coverage Status](https://coveralls.io/repos/github/vanpho93/slowie/badge.svg?branch=master)](https://coveralls.io/github/vanpho93/slowie?branch=master)
# Slowie

A new framwork for `graphql` - `mongodb` - `redis` - `kakfa` focus on speeding up API development process.

## The idea

You define a model, all APIs will be generated in `graphql`. Instead of doing tedious jobs in many files (model, service, controller, api docs), you just define a model in a single file, all APIs will be ready. In the future, we can add more and more options, therefore making the code more reusable and fun.

## Basic usage

```typescript
import { Slowie, graphql } from 'slowie'

// step 1: Define context interface
export interface IContext {
  role: string
}

// step 2: Init app and define `context` method, showing how to get context from `req`
export const app = new Slowie<IContext>({
  // How to get context from the request
  context: async (req) => ({ role: req.headers.role || 'GUEST' }),
})

// step 3: Create a model
interface IUser {
  email: string
  countryId: string
}

export const User = app.createModel<IUser>({
  name: 'User',
  schema: {
    email: {
      graphql: {
        default: { type: graphql.GraphQLString },
        create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        update: null,
      },
      db: { type: String, required: true, unique: true },
    },
    countryId: {
      graphql: {
        default: { type: graphql.GraphQLString },
      },
      db: { type: String },
    },
  },
})

User.createIndexes()

// step 4: Connect database
app.mongoose.connect(
  'mongodb://localhost:27017/slowie',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
)

// step 5: Start server
app.getServer().listen(
  3000,
  () => console.log('Play server started at http://localhost:3000')
)


```

After run this, you can open `http://localhost:3000` and interact with all generated apis

## Example

A sample project can be found [here](https://github.com/vanpho93/slowie-example)
