[![CircleCI](https://circleci.com/gh/vanpho93/slowie.svg?style=svg)](https://circleci.com/gh/vanpho93/slowie) [![Coverage Status](https://coveralls.io/repos/github/vanpho93/slowie/badge.svg?branch=master)](https://coveralls.io/github/vanpho93/slowie?branch=master)
# Slowie

A new framwork for `graphql` - `mongodb` - `redis` - `kakfa` focus on speeding up API development process.

## The idea

You define a model, all APIs will be generated in `graphql`. Instead of doing tedious jobs in many files (model, service, controller, api docs), you just define a model in a single file, all APIs will be ready. In the future, we can add more and more options, therefore making the code more reusable and fun.

## Development env

Step 1: Copy env file

```
cp sample.env .env
```
> A mongodb instance running is required, you can change database url in `.env` file

Step 2: Install dependencies
```
yarn install
```

Step 3: Run
```
yarn start
```

Step 4: Open http://localhost:4000 to play with the APIs

## Example

Take a look at `user.ts`
