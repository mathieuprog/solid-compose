import ColorScheme from './color-scheme/ColorScheme';
import ColorSchemeStylesheet from './color-scheme/ColorSchemeStylesheet';
import getSystemColorScheme from './color-scheme/getSystemColorScheme';
import ColorSchemeStorage from './color-scheme/ColorSchemeStorage';
import useColorScheme from './color-scheme/useColorScheme';
import createColorSchemePrimitive from './color-scheme/createColorSchemePrimitive';

import useLocalStorage, { createLocalStoragePrimitive } from './storage/useLocalStorage';

import { addTranslations } from './i18n/addTranslations';
import useI18n from './i18n/useI18n';
import createI18nPrimitive from './i18n/createI18nPrimitive';

import useLocale from './locale/useLocale';
import createLocalePrimitive from './locale/createLocalePrimitive';
import getDefaultLocale from './locale/getDefaultLocale';

export {
  addTranslations,
  createI18nPrimitive,
  useI18n,

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
