import test from 'ava';
import neutrino from '..';

const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('default mode derived from production NODE_ENV', t => {
  process.env.NODE_ENV = 'production';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'production');
});

test('default mode derived from development NODE_ENV', t => {
  process.env.NODE_ENV = 'development';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'development');
});

test('default mode derived from test NODE_ENV', t => {
  process.env.NODE_ENV = 'test';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'development');
});

test('undefined mode and NODE_ENV sets only NODE_ENV', t => {
  delete process.env.NODE_ENV;
  const webpackConfig = neutrino().output('webpack');
  t.is(process.env.NODE_ENV, 'production');
  t.false('mode' in webpackConfig);
});

test('throws when vendor entrypoint defined', t => {
  const err = t.throws(() => {
    neutrino(neutrino => {
      neutrino.config.entry('vendor').add('lodash');
    }).output('webpack');
  });

  t.true(err.message.includes('Remove the manual `vendor` entrypoint'));
});

test('throws when trying to use a non-registered output', t => {
  const err = t.throws(() =>
    neutrino(Function.prototype).output('fake')
  );

  t.true(err.message.includes('Unable to find an output handler'));
});

test('throws when trying to use a non-registered proxied method', t => {
  const err = t.throws(() =>
    neutrino(Function.prototype).fake()
  );

  t.true(err.message.includes('Unable to find an output handler'));
});

test('exposes webpack output handler', t => {
  t.notThrows(() =>
    neutrino(Function.prototype).output('webpack')
  );
});

test('exposes webpack config from output', t => {
  const handler = neutrino(Function.prototype).output('webpack');
  t.is(typeof handler, 'object');
});

test('exposes webpack method', t => {
  t.is(typeof neutrino(Function.prototype).webpack, 'function');
});

test('exposes webpack config from method', t => {
  const handler = neutrino(Function.prototype).webpack();
  t.is(typeof handler, 'object');
});
