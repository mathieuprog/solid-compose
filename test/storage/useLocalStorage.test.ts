import { createRoot } from 'solid-js';
import { describe, expect, test } from 'vitest';
import useLocalStorage from '@/storage/useLocalStorage';

// @vitest-environment happy-dom

describe('useLocalStorage', () => {
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
});
