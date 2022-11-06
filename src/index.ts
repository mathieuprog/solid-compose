import ColorScheme from './color-scheme/ColorScheme';
import ColorSchemeStorage from './color-scheme/ColorSchemeStorage';
import ColorSchemeStylesheet from './color-scheme/ColorSchemeStylesheet';
import createColorSchemePrimitive from './color-scheme/createColorSchemePrimitive';
import getSystemColorScheme from './color-scheme/getSystemColorScheme';
import useColorScheme from './color-scheme/useColorScheme';

import createLocalStoragePrimitive from './storage/createLocalStoragePrimitive';
import useLocalStorage from './storage/useLocalStorage';

import addTranslations from './i18n/addTranslations';
import createI18nPrimitive from './i18n/createI18nPrimitive';
import useI18n from './i18n/useI18n';

import createLocalePrimitive from './locale/createLocalePrimitive';
import getDefaultLocale from './locale/getDefaultLocale';
import useLocale from './locale/useLocale';
import { I18nProvider, useNamespacedI18n } from './i18n/context';

export {
  addTranslations,
  createI18nPrimitive,
  I18nProvider,
  useI18n,
  useNamespacedI18n,

  ColorScheme,
  ColorSchemeStorage,
  ColorSchemeStylesheet,
  createColorSchemePrimitive,
  getSystemColorScheme,
  useColorScheme,

  createLocalStoragePrimitive,
  useLocalStorage,

  createLocalePrimitive,
  getDefaultLocale,
  useLocale,
}
