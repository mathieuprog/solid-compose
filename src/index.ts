import {
  ColorScheme,
  DateEndianness,
  FirstDayOfWeek
} from 'user-locale';

import createLocalStoragePrimitive from './storage/createLocalStoragePrimitive';
import useLocalStorage from './storage/useLocalStorage';

import createI18nPrimitive from './i18n/createI18nPrimitive';
import { addTranslations, getSupportedLanguageTags } from './i18n/registry';
import useI18n from './i18n/useI18n';

import ColorSchemeStylesheet from './locale/ColorSchemeStylesheet';
import createLocalePrimitive from './locale/createLocalePrimitive';
import useLocale from './locale/useLocale';
import { I18nProvider, useNamespacedI18n } from './i18n/context';

export {
  addTranslations,
  createI18nPrimitive,
  getSupportedLanguageTags,
  I18nProvider,
  useI18n,
  useNamespacedI18n,

  createLocalStoragePrimitive,
  useLocalStorage,

  ColorScheme,
  ColorSchemeStylesheet,
  createLocalePrimitive,
  DateEndianness,
  FirstDayOfWeek,
  useLocale
}
