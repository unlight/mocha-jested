import Mocha from 'mocha';
import Expect from 'expect';
import { interpolateArray } from './jest-each';

const { EVENT_FILE_PRE_REQUIRE } = Mocha.Suite.constants;
const { bdd } = Mocha.interfaces;

declare module 'mocha' {
  interface MochaGlobals {
    beforeAll: Mocha.HookFunction;
    afterAll: Mocha.HookFunction;
    expect: typeof Expect;
  }
  interface TestFunction {
    todo: (title: string) => Mocha.Test;
    each: typeof testEach;
  }
}

let expect: typeof Expect;
try {
  expect = require('expect');
  // eslint-disable-next-line no-empty
} catch {}

function bddJestedInterface(suite: Mocha.Suite) {
  bdd(suite);

  suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
    context.beforeAll = context.before;
    context.afterAll = context.after;
    context.it.todo = context.it;
    context.it.each = testEach;
    context.expect = expect;
  });
}

function testEach(table: any[]) {
  const it = global.it;

  return function (pattern: string, function_: (...args: any[]) => any) {
    const testArray = interpolateArray(pattern, table);

    for (const test of testArray) {
      it(test.title, function_.bind(undefined, ...test.arguments));
    }
  };
}

export default bddJestedInterface;

// eslint-disable-next-line unicorn/prefer-module
module.exports = bddJestedInterface;
// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-member-access
module.exports.default = bddJestedInterface;
