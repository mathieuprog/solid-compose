import ColorScheme from './color-scheme/ColorScheme';
import ColorSchemeStylesheet from './color-scheme/ColorSchemeStylesheet';
import getSystemColorScheme from './color-scheme/getSystemColorScheme';
import ColorSchemeStorage from './color-scheme/ColorSchemeStorage';
import useColorScheme from './color-scheme/useColorScheme';
import createColorSchemePrimitive from './color-scheme/createColorSchemePrimitive';

import useLocalStorage, { createLocalStoragePrimitive } from './storage/useLocalStorage';

import {
  addTranslations,
  enableNestedTranslations,
  setFallbackLocalesForMissingTranslations
} from './i18n/useI18n';
import useContext18n, { I18nProvider, setupI18n } from './i18n/useI18n/context';
import useGlobal18n, { createI18nPrimitive } from './i18n/useI18n/global';

import useLocale from './locale/useLocale';
import createLocalePrimitive from './locale/createLocalePrimitive';
import getDefaultLocale from './locale/getDefaultLocale';

export {
  addTranslations,
  createI18nPrimitive,
  enableNestedTranslations,
  I18nProvider,
  setFallbackLocalesForMissingTranslations,
  setupI18n,
  useContext18n,
  useGlobal18n,

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
