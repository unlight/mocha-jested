import Mocha from 'mocha';
import Expect from 'expect';

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
    context.expect = expect;
  });
}

export default bddJestedInterface;

// eslint-disable-next-line unicorn/prefer-module
module.exports = bddJestedInterface;
// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-member-access
module.exports.default = bddJestedInterface;
