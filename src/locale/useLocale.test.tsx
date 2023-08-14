import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  formatNumber,
  useLocale
} from '..';
import { NumberFormat } from 'user-locale';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useLocale()
  ).toThrow(/createLocalePrimitive/);
});

test('set language tag', () => {
  createLocalePrimitive({
    supportedLanguageTags: ['es', 'it']
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

test('get default language tag when given', () => {
  createLocalePrimitive({
    defaultLanguageTag: 'yy',
    supportedLanguageTags: ['xx', 'yy', 'zz']
  });

  const [locale] = useLocale();

  expect(locale.languageTag).toBe('yy');
});

test('get initial language tag when default given', () => {
  createLocalePrimitive({
    defaultLanguageTag: 'zz',
    initialValues: {
      languageTag: 'yy'
    },
    supportedLanguageTags: ['xx', 'yy', 'zz']
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
        defaultLanguageTag: 'nl',
        supportedLanguageTags: ['es', 'en', 'fr']
      });
    }
  ).toThrow(/nl not found in supported language tags/);
});

test('initial language tag not supported should throw error', () => {
  expect(
    () => {
      createLocalePrimitive({
        initialValues: {
          languageTag: 'nl'
        },
        supportedLanguageTags: ['es', 'en', 'fr']
      });
    }
  ).toThrow(/nl not found in supported language tags/);
});

test('set color scheme', () => {
  createLocalePrimitive({
    initialValues: {
      colorScheme: ColorScheme.Dark
    },
    supportedLanguageTags: ['es']
  });

  const [locale, { setColorScheme }] = useLocale();

  expect(locale.colorScheme).toBe(ColorScheme.Dark);

  setColorScheme(ColorScheme.Light);

  expect(locale.colorScheme).toBe(ColorScheme.Light);
});

test('format number', () => {
  createLocalePrimitive({
    initialValues: {
      numberFormat: NumberFormat.CommaPeriod
    },
    supportedLanguageTags: ['en']
  });

  const [locale, { setNumberFormat }] = useLocale();
  expect(locale.numberFormat).toBe(NumberFormat.CommaPeriod);

  expect(formatNumber(1000.01)).toBe('1,000.01');

  setNumberFormat(NumberFormat.SpaceComma);
  expect(locale.numberFormat).toBe(NumberFormat.SpaceComma);

  expect(formatNumber(1000.01)).toBe('1\u202F000,01');

  setNumberFormat(NumberFormat.PeriodComma);
  expect(locale.numberFormat).toBe(NumberFormat.PeriodComma);

  expect(formatNumber(1000.01)).toBe('1.000,01');

  expect(formatNumber(1000.01, { useGrouping: false })).toBe('1000,01');
});
