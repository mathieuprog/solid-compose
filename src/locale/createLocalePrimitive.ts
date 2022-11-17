import { createStore } from 'solid-js/store';
import { setPrimitive } from './globalPrimitive';
import type { Setter } from './globalPrimitive';
import {
  ColorScheme,
  DateEndianness,
  FirstDayOfWeek,
  getColorScheme,
  getDateFormat,
  getFirstDayOfWeek,
  getPreferredLanguageTags,
  getTimeFormat,
  getTimeZone
} from 'user-locale';

interface Config {
  defaultColorScheme?: ColorScheme;
  defaultLanguageTag?: string;
  supportedLanguageTags: string[];
}

export default function createLocalePrimitive(config: Config) {
  const preferredLanguageTags = getPreferredLanguageTags();

  const defaultLanguageTag = getDefaultLanguageTag(preferredLanguageTags, config.supportedLanguageTags, config?.defaultLanguageTag || 'en');

  const [locale, setLocale] =
    createStore({
      languageTag: defaultLanguageTag,
      supportedLanguageTags: config.supportedLanguageTags,
      timeZone: getTimeZone(),
      dateFormat: getDateFormat(),
      timeFormat: getTimeFormat(),
      firstDayOfWeek: getFirstDayOfWeek(),
      colorScheme: config?.defaultColorScheme ?? getColorScheme()
    });

  const setLanguageTag_ = (languageTag: string) => setLocale({ languageTag });
  const setTimeZone_ = (timeZone: string) => setLocale({ timeZone });
  const setDateEndianness_ = (endianness: DateEndianness) => setLocale('dateFormat', 'endianness', endianness);
  const setDateSeparator_ = (separator: string) => setLocale('dateFormat', 'separator', separator);
  const set24HourClock_ = (is24HourClock: boolean) => setLocale('timeFormat', 'is24HourClock', is24HourClock);
  const setTimeSeparator_ = (separator: string) => setLocale('timeFormat', 'separator', separator);
  const setFirstDayOfWeek_ = (firstDayOfWeek: FirstDayOfWeek) => setLocale({ firstDayOfWeek });
  const setColorScheme_ = (colorScheme: ColorScheme) => setLocale({ colorScheme });

  const setLanguageTag: Setter<string> = (arg) => (typeof arg === 'function') ? setLanguageTag_(arg(locale.languageTag)) : setLanguageTag_(arg);
  const setTimeZone: Setter<string> = (arg) => (typeof arg === 'function') ? setTimeZone_(arg(locale.timeZone)) : setTimeZone_(arg);
  const setDateEndianness: Setter<DateEndianness> = (arg) => (typeof arg === 'function') ? setDateEndianness_(arg(locale.dateFormat.endianness)) : setDateEndianness_(arg);
  const setDateSeparator: Setter<string> = (arg) => (typeof arg === 'function') ? setDateSeparator_(arg(locale.dateFormat.separator)) : setDateSeparator_(arg);
  const set24HourClock: Setter<boolean> = (arg) => (typeof arg === 'function') ? set24HourClock_(arg(locale.timeFormat.is24HourClock)) : set24HourClock_(arg);
  const setTimeSeparator: Setter<string> = (arg) => (typeof arg === 'function') ? setTimeSeparator_(arg(locale.timeFormat.separator)) : setTimeSeparator_(arg);
  const setFirstDayOfWeek: Setter<FirstDayOfWeek> = (arg) => (typeof arg === 'function') ? setFirstDayOfWeek_(arg(locale.firstDayOfWeek)) : setFirstDayOfWeek_(arg);
  const setColorScheme: Setter<ColorScheme> = (arg) => (typeof arg === 'function') ? setColorScheme_(arg(locale.colorScheme)) : setColorScheme_(arg);

  setPrimitive([locale, {
    setLanguageTag,
    setTimeZone,
    setDateEndianness,
    setDateSeparator,
    set24HourClock,
    setTimeSeparator,
    setFirstDayOfWeek,
    setColorScheme
  }]);
}

export function getDefaultLanguageTag(preferredLanguageTags: string[], supportedLanguageTags: string[], defaultLanguageTag: string): string {
  if (supportedLanguageTags.length === 0) {
    throw new Error('Add at least one language in `supportedLanguageTags` option');
  }
  
  const preferredSupportedLanguageTags = preferredLanguageTags.filter((languageTag) => supportedLanguageTags.includes(languageTag));

  if (preferredSupportedLanguageTags.length > 0) {
    return preferredSupportedLanguageTags[0];
  }

  return defaultLanguageTag && supportedLanguageTags.includes(defaultLanguageTag)
    ? defaultLanguageTag
    : supportedLanguageTags[0];
}
