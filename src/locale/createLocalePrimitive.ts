import { createStore } from 'solid-js/store';
import { batch } from 'solid-js';
import {
  ColorScheme,
  DateFormat,
  FirstDayOfWeek,
  getColorScheme,
  getDateFormat,
  getFirstDayOfWeek,
  getNumberFormat,
  getPreferredLanguageTags,
  getTimeFormat,
  getTimeZone,
  NumberFormat,
  TimeFormat
} from 'user-locale';
import findValue from '@mathieuprog/find-value';
import { setPrimitive } from './globalPrimitive';
import type { Setter } from './globalPrimitive';
import getTextDirection from './getTextDirection';
import isPartOfLanguageTag from './isPartOfLanguageTag';
import TextDirection from './TextDirection';

interface Config {
  defaultLanguageTag?: string;
  initialValues?: {
    languageTag?: string,
    timeZone?: string,
    numberFormat?: NumberFormat,
    dateFormat?: DateFormat,
    timeFormat?: TimeFormat,
    firstDayOfWeek?: FirstDayOfWeek,
    colorScheme?: ColorScheme
  };
  supportedLanguageTags: string[];
}

export default function createLocalePrimitive(config: Config) {
  if (!config.supportedLanguageTags || config.supportedLanguageTags.length === 0) {
    throw new Error('no supported language tags provided');
  }

  if (config.defaultLanguageTag && !config.supportedLanguageTags.includes(config.defaultLanguageTag)) {
    throw new Error(`${config.defaultLanguageTag} not found in supported language tags`);
  }

  if (config.initialValues?.languageTag && !config.supportedLanguageTags.includes(config.initialValues?.languageTag)) {
    throw new Error(`${config.initialValues?.languageTag} not found in supported language tags`);
  }

  const preferredLanguageTags = getPreferredLanguageTags();

  const preferredSupportedLanguageTag =
    findValue(preferredLanguageTags, (preferredLanguageTag) => {
      if (config.supportedLanguageTags.includes(preferredLanguageTag)) {
        return preferredLanguageTag;
      }

      return config.supportedLanguageTags.find((supportedLanguageTag) => {
        return isPartOfLanguageTag(preferredLanguageTag, supportedLanguageTag) && supportedLanguageTag;
      });
    });

  const languageTag =
    preferredSupportedLanguageTag
      ?? config?.initialValues?.languageTag
      ?? config.defaultLanguageTag
      ?? config.supportedLanguageTags.find((languageTag) => languageTag.startsWith('en'))
      ?? config.supportedLanguageTags[0];

  const [locale, setLocale] =
    createStore({
      supportedLanguageTags: config.supportedLanguageTags,
      languageTag,
      textDirection: getTextDirection(languageTag),
      timeZone: config?.initialValues?.timeZone ?? getTimeZone(),
      numberFormat: config?.initialValues?.numberFormat ?? getNumberFormat(),
      dateFormat: config?.initialValues?.dateFormat ?? getDateFormat(),
      timeFormat: config?.initialValues?.timeFormat ?? getTimeFormat(),
      firstDayOfWeek: config?.initialValues?.firstDayOfWeek ?? getFirstDayOfWeek(),
      colorScheme: config?.initialValues?.colorScheme ?? getColorScheme()
    });

  const setLanguageTag_ = (languageTag: string) => {
    if (!config.supportedLanguageTags.includes(languageTag)) {
      throw new Error(`${languageTag} not found in supported language tags`);
    }
    setLocale({ languageTag, textDirection: getTextDirection(languageTag) });
  };
  const setTimeZone_ = (timeZone: string) => setLocale({ timeZone });
  const setNumberFormat_ = (numberFormat: NumberFormat) => setLocale({ numberFormat });
  const setDateFormat_ = (dateFormat: DateFormat) => setLocale({ dateFormat });
  const setTimeFormat_ = (timeFormat: TimeFormat) => setLocale({ timeFormat });
  const setFirstDayOfWeek_ = (firstDayOfWeek: FirstDayOfWeek) => setLocale({ firstDayOfWeek });
  const setColorScheme_ = (colorScheme: ColorScheme) => setLocale({ colorScheme });
  const setTextDirection_ = (textDirection: TextDirection) => setLocale({ textDirection });

  const setLanguageTag: Setter<string> = (arg) => (typeof arg === 'function') ? setLanguageTag_(arg(locale.languageTag)) : setLanguageTag_(arg);
  const setTimeZone: Setter<string> = (arg) => (typeof arg === 'function') ? setTimeZone_(arg(locale.timeZone)) : setTimeZone_(arg);
  const setNumberFormat: Setter<NumberFormat> = (arg) => (typeof arg === 'function') ? setNumberFormat_(arg(locale.numberFormat)) : setNumberFormat_(arg);
  const setDateFormat: Setter<DateFormat> = (arg) => (typeof arg === 'function') ? setDateFormat_(arg(locale.dateFormat)) : setDateFormat_(arg);
  const setTimeFormat: Setter<TimeFormat> = (arg) => (typeof arg === 'function') ? setTimeFormat_(arg(locale.timeFormat)) : setTimeFormat_(arg);
  const setFirstDayOfWeek: Setter<FirstDayOfWeek> = (arg) => (typeof arg === 'function') ? setFirstDayOfWeek_(arg(locale.firstDayOfWeek)) : setFirstDayOfWeek_(arg);
  const setColorScheme: Setter<ColorScheme> = (arg) => (typeof arg === 'function') ? setColorScheme_(arg(locale.colorScheme)) : setColorScheme_(arg);
  const setTextDirection: Setter<TextDirection> = (arg) => (typeof arg === 'function') ? setTextDirection_(arg(locale.textDirection)) : setTextDirection_(arg);

  const setLocale_ = (props: SettableLocaleProps) => {
    batch(() => {
      if (props.languageTag !== undefined) {
        setLanguageTag_(props.languageTag);
      }

      if (props.timeZone !== undefined) {
        setTimeZone_(props.timeZone);
      }

      if (props.numberFormat !== undefined) {
        setNumberFormat_(props.numberFormat);
      }

      if (props.dateFormat !== undefined) {
        setDateFormat_(props.dateFormat);
      }

      if (props.timeFormat !== undefined) {
        setTimeFormat_(props.timeFormat);
      }

      if (props.firstDayOfWeek !== undefined) {
        setFirstDayOfWeek_(props.firstDayOfWeek);
      }

      if (props.colorScheme !== undefined) {
        setColorScheme_(props.colorScheme);
      }
    });
  };

  setPrimitive([locale, {
    setLanguageTag,
    setTimeZone,
    setNumberFormat,
    setDateFormat,
    setTimeFormat,
    setFirstDayOfWeek,
    setColorScheme,
    setLocale: setLocale_,
    // Provided only for testing purposes. The text direction is normally set by the language.
    __setTextDirection: setTextDirection
  }]);
}

export interface SettableLocaleProps {
  languageTag?: string;
  timeZone?: string;
  numberFormat?: NumberFormat;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  firstDayOfWeek?: FirstDayOfWeek;
  colorScheme?: ColorScheme;
};
