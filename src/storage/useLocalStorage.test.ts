import { createRoot } from 'solid-js';
import { expect, test } from 'vitest';
import { createLocalStoragePrimitive, useLocalStorage } from '..';

// @vitest-environment happy-dom

test('createLocalStoragePrimitive', () => {
  createRoot((dispose) => {
    createLocalStoragePrimitive('key1', 'a value');
    createLocalStoragePrimitive('key2', 'another value');

    const [value1] = useLocalStorage('key1', 'foo');
    expect(value1()).toEqual('a value');

    const [value2] = useLocalStorage('key2', 'foo');
    expect(value2()).toEqual('another value');

    const [value3] = useLocalStorage('key3', 'foo');
    expect(value3()).toEqual('foo');

    dispose();
  });
});

test('initialize state with pre-existing value from localStorage', () => {
  createRoot((dispose) => {
    localStorage.setItem('foo', JSON.stringify('hello'));

    const [value, { remove: removeValue }] = useLocalStorage('foo', 'world');

    expect(value()).toEqual('hello');

    removeValue();

    expect(value()).toBeNull();
    expect(localStorage.getItem('foo')).toBeNull();

    dispose();
  });
});

test('initialize state with pre-existing value from localStorage', () => {
  createRoot((dispose) => {
    localStorage.setItem('foo', JSON.stringify('hello'));

    const [value, { remove: removeValue }] = useLocalStorage('foo', 'world');

    expect(value()).toEqual('hello');

    removeValue();

    expect(value()).toBeNull();
    expect(localStorage.getItem('foo')).toBeNull();

    dispose();
  });
});

test('update state and localStorage', () => {
  createRoot((dispose) => {
    expect(localStorage.getItem('foo')).toBeNull();

    const [value, { set: setValue, remove: removeValue }] = useLocalStorage('foo', 'world');
    useLocalStorage('bar');

    expect(JSON.parse(localStorage.getItem('foo') as string)).toEqual('world');

    expect(value()).toEqual('world');

    setValue('hello');

    expect(value()).toEqual('hello');
    expect(JSON.parse(localStorage.getItem('foo') as string)).toEqual('hello');

    removeValue();

    expect(value()).toBeNull();
    expect(localStorage.getItem('foo')).toBeNull();

    dispose();
  });
});
