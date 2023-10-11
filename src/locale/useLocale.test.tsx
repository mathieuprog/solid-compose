import { afterEach, expect, test } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { cleanup } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  parseNumber,
  formatNumber,
  formatDate,
  formatTime,
  useLocale
} from '..';
import { DateEndianness, NumberFormat } from 'user-locale';

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

test('parse number', () => {
  createLocalePrimitive({
    initialValues: {
      numberFormat: NumberFormat.CommaPeriod
    },
    supportedLanguageTags: ['en']
  });

  const [locale, { setNumberFormat }] = useLocale();
  expect(locale.numberFormat).toBe(NumberFormat.CommaPeriod);

  expect(parseNumber('1000.01')).toBe(1000.01);
  expect(parseNumber('1,000.01', { allowThousandSeparator: true })).toBe(1000.01);

  setNumberFormat(NumberFormat.SpaceComma);
  expect(locale.numberFormat).toBe(NumberFormat.SpaceComma);

  expect(parseNumber('1000,01')).toBe(1000.01);
  expect(parseNumber('1 000,01', { allowThousandSeparator: true })).toBe(1000.01);

  setNumberFormat(NumberFormat.PeriodComma);
  expect(locale.numberFormat).toBe(NumberFormat.PeriodComma);

  expect(parseNumber('1000,01')).toBe(1000.01);
  expect(parseNumber('1.000,01', { allowThousandSeparator: true })).toBe(1000.01);
});

test('format date', () => {
  createLocalePrimitive({
    initialValues: {
      dateFormat: { endianness: DateEndianness.LittleEndian }
    },
    supportedLanguageTags: ['en']
  });

  const [locale, { setDateFormat }] = useLocale();

  expect(locale.dateFormat).toEqual({ endianness: DateEndianness.LittleEndian });
  expect(formatDate(Temporal.PlainDate.from('2000-12-31'))).toBe('31/12/2000');

  setDateFormat({ endianness: DateEndianness.MiddleEndian });

  expect(locale.dateFormat).toEqual({ endianness: DateEndianness.MiddleEndian });
  expect(formatDate(Temporal.PlainDate.from('2000-12-31'))).toBe('12/31/2000');
});

test('format time', () => {
  createLocalePrimitive({
    initialValues: {
      timeFormat: { is24HourClock: true }
    },
    supportedLanguageTags: ['en']
  });

  const [locale, { setTimeFormat }] = useLocale();

  expect(locale.timeFormat).toEqual({ is24HourClock: true });
  expect(formatTime(Temporal.PlainTime.from('00:00:05'), { precision: 'minute', omitZeroUnits: true })).toBe('00:00');

  setTimeFormat({ is24HourClock: false });

  expect(locale.timeFormat).toEqual({ is24HourClock: false });
  expect(formatTime(Temporal.PlainTime.from('00:00:05'), { precision: 'minute', omitZeroUnits: true })).toBe('12 AM');
});
