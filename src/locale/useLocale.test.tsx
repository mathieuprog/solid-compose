import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  useLocale
} from '..';
import { getDefaultLanguageTag } from './createLocalePrimitive';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useLocale()
  ).toThrow(/createLocalePrimitive/);
});

test('set language tag', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['es']
  });

  const [locale, { setLanguageTag }] = useLocale();

  expect(locale.languageTag).toBe('es');

  setLanguageTag('it');

  expect(locale.languageTag).toBe('it');
});

test('get default language tag', () => {
  createLocalePrimitive({
    defaultLanguageTag: 'fr',
    supportedLanguageTags: ['es', 'fr']
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('fr');
});

test('set color scheme', () => {
  createLocalePrimitive({
    defaultColorScheme: ColorScheme.Dark,
    supportedLanguageTags: ['es']
  });

  const [locale, { setColorScheme }] = useLocale();

  expect(locale.colorScheme).toBe(ColorScheme.Dark);

  setColorScheme(ColorScheme.Light);

  expect(locale.colorScheme).toBe(ColorScheme.Light);
});

test('getDefaultLanguageTag', () => {
  expect(getDefaultLanguageTag(['en-US', 'en'], ['fr', 'es'], 'en')).toBe('fr');
  expect(getDefaultLanguageTag(['en-US', 'en'], ['fr', 'es'], 'es')).toBe('es');
  expect(getDefaultLanguageTag(['en-US', 'en'], ['en'], 'es')).toBe('en');
});
