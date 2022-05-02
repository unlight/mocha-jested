import Mocha from 'mocha';

const { EVENT_FILE_PRE_REQUIRE } = Mocha.Suite.constants;
const { bdd } = Mocha.interfaces;

declare module 'mocha' {
  interface MochaGlobals {
    beforeAll: Mocha.HookFunction;
    afterAll: Mocha.HookFunction;
  }
  interface TestFunction {
    todo: (title: string) => Mocha.Test;
  }
}

function bddJestedInterface(suite: Mocha.Suite) {
  bdd(suite);

  suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
    context.beforeAll = context.before;
    context.afterAll = context.after;
    context.it.todo = context.it;
  });
}

export default bddJestedInterface;

// eslint-disable-next-line unicorn/prefer-module
module.exports = bddJestedInterface;
// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-member-access
module.exports.default = bddJestedInterface;
