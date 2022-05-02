# mocha-jested

Bring some jest API to mocha.

## Features

- Hook `beforeAll` as `before`
- Hook `afterAll` as `after`
- `it(string)` as `it.todo(string)`

## Install

```sh
npm install --save-dev mocha-jested
```

## Usage

Add `--ui=mocha-jested` to your `mocha` command

```sh
mocha --ui=mocha-jested src/*.spec.ts
```
