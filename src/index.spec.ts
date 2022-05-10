import expect from 'expect';
import Mocha from 'mocha';
import bddJestedInterface from './index';

const { EVENT_FILE_PRE_REQUIRE } = Mocha.Suite.constants;

it('smoke', function () {
  expect(bddJestedInterface).toBeDefined();
});

describe('context', () => {
  let mocha: Mocha;
  let testContext: Mocha.MochaGlobals;
  let runner: Mocha.Runner;
  beforeEach(() => {
    mocha = new Mocha({ ui: 'mocha-jested' as any });
    mocha.addFile(require.resolve('./fixture.js'));
  });

  it('global hooks before/after all', () => {
    runner = mocha.run();
    const globals = runner.globals();
    expect(globals).toContainEqual('beforeAll');
    expect(globals).toContainEqual('afterAll');
  });

  it('it todo', () => {
    mocha.suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
      testContext = context;
    });

    runner = mocha.run();

    expect(testContext.it.todo).toBe(testContext.it);
  });

  it('expect', () => {
    mocha.suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
      testContext = context;
    });

    runner = mocha.run();

    expect(typeof testContext.expect).toBe('function');
    expect(testContext.expect).toBe(expect);
  });
});
