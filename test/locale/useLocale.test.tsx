import { afterEach, describe, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  createLocalePrimitive,
  useLocale
} from '@/index';

describe('useLocale', () => {
  afterEach(cleanup);

  test('missing global state should throw error', () => {
    expect(
      () => useLocale()
    ).toThrow(/createLocalePrimitive/);
  });

  test('no default', () => {
    createLocalePrimitive();

    const [locale, setLocale] = useLocale();

    expect(locale()).toBeTruthy();

    setLocale('it');

    expect(locale()).toBe('it');
  });

  test('set default', () => {
    createLocalePrimitive({
      default: 'es'
    });

    const [locale, setLocale] = useLocale();

    expect(locale()).toBe('es');

    setLocale('it');

    expect(locale()).toBe('it');
  });
});
