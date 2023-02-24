import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  useLocale
} from '..';

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

test('empty supportedLanguageTags', () => {
  expect(
    () => {
      createLocalePrimitive({
        supportedLanguageTags: []
      });
    }
  ).toThrow(/no supported language tags/);
});

test('get default language tag', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['xx', 'yy']
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('xx');
});

test('get default language tag when default given', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['xx', 'yy', 'zz'],
    defaultLanguageTag: 'yy'
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('yy');
});

test('get default language tag when no default english is present', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['xx', 'yy', 'en-XX']
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('en-XX');
});

test('get default language tag when no default and no english is present', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['xx', 'yy', 'zz']
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('xx');
});

test('default language tag not supported should throw error', () => {
  expect(
    () => {
      createLocalePrimitive({
        supportedLanguageTags: ['es', 'en', 'fr'],
        defaultLanguageTag: 'nl'
      });
    }
  ).toThrow(/nl not found in supported language tags/);
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

