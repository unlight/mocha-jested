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
    testContext = undefined as any;
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

  describe('it.each', () => {
    beforeEach(() => {
      mocha.suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
        testContext = context;
      });

      runner = mocha.run();
    });

    it('function', () => {
      expect(typeof testContext.it.each).toBe('function');

      testContext.it.each([
        [1, 1, 2],
        [2, 2, 4],
      ])('sum %# %i', (a, b, expected) => {
        expect(a + b).toBe(expected);
      });
    });

    it('interpolate', () => {
      testContext.it.each([
        { a: 1, b: 1, expected: 2 },
        { a: 2, b: 2, expected: 4 },
      ])('add $a + $b', ({ a, b, expected }) => {
        expect(a + b).toBe(expected);
      });
    });

    it('only each', () => {
      expect(typeof testContext.it.only.each).toBe('function');
    });

    it('each skip', () => {});
  });

  describe('jest-mock', () => {
    beforeEach(() => {
      mocha.suite.on(EVENT_FILE_PRE_REQUIRE, function (context) {
        testContext = context;
      });

      runner = mocha.run();
    });

    it('global jest', () => {
      expect(testContext.jest).toBeDefined();
    });

    it('spyOn', () => {
      expect(testContext.spyOn).toBeDefined();
      expect(testContext.jest.spyOn).toBeDefined();
      expect(
        typeof testContext.jest.spyOn({ a: Function }, 'a').mockResolvedValue,
      ).toBeDefined();
    });
  });
});
