import Mocha from 'mocha';
import expect from 'expect';
import { interpolateArray } from './jest-each';
import { spyOn, fn, mocked } from 'jest-mock';

const { EVENT_FILE_PRE_REQUIRE } = Mocha.Suite.constants;
const { bdd } = Mocha.interfaces;

declare module 'mocha' {
  interface MochaGlobals {
    beforeAll: Mocha.HookFunction;
    afterAll: Mocha.HookFunction;
    expect: typeof expect;
    spyOn: typeof spyOn;
    jest: {
      spyOn: typeof spyOn;
      fn: typeof fn;
      mocked: typeof mocked;
    };
  }
  interface TestFunction {
    todo: (title: string) => Mocha.Test;
    each: Function;
  }
  interface ExclusiveTestFunction {
    each: Function;
  }
}

function bddJestedInterface(suite: Mocha.Suite) {
  bdd(suite);

  suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
    context.expect = expect;
    context.beforeAll = context.before;
    context.afterAll = context.after;
    context.jest = { spyOn, fn, mocked };
    context.spyOn = spyOn;
    context.it.todo = context.it;
    context.it.each = createTestEach(context.it);
    context.it.only['each'] = createTestEach(context.it.only);
  });
}

function createTestEach(it: Mocha.TestFunction | Function) {
  return function testEach(table: any[]) {
    return function (pattern: string, function_: (...args: any[]) => any) {
      const testArray = interpolateArray(pattern, table);

      for (const test of testArray) {
        it(test.title, function_.bind(undefined, ...test.arguments));
      }
    };
  };
}

export default bddJestedInterface;

// eslint-disable-next-line unicorn/prefer-module
module.exports = bddJestedInterface;
// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-member-access
module.exports.default = bddJestedInterface;
