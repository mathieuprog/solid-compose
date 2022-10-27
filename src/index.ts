import ColorSchemeStylesheet from './color-scheme/ColorSchemeStylesheet';
import getSystemColorScheme from './color-scheme/getSystemColorScheme';
import { ColorSchemeStorage } from './color-scheme/useColorScheme';
import useContextColorScheme, { ColorSchemeProvider } from './color-scheme/useColorScheme/context';
import useGlobalColorScheme, { createColorSchemePrimitive } from './color-scheme/useColorScheme/global';
import useLocalStorage, { createLocalStoragePrimitive } from './storage/useLocalStorage';
import {
  addTranslations,
  enableNestedTranslations,
  setFallbackLocalesForMissingTranslations
} from './i18n/useI18n';
import useContext18n, { I18nProvider, setupI18n } from './i18n/useI18n/context';
import useGlobal18n, { createI18nPrimitive } from './i18n/useI18n/global';
import useLocale, { createLocalePrimitive } from './locale/useLocale';
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

  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet,
  createColorSchemePrimitive,
  getSystemColorScheme,
  useContextColorScheme,
  useGlobalColorScheme,

  createLocalStoragePrimitive,
  useLocalStorage,

  createLocalePrimitive,
  getDefaultLocale,
  useLocale,
}
