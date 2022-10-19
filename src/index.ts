import ColorSchemeStylesheet from './color-scheme/ColorSchemeStylesheet';
import getSystemColorScheme from './color-scheme/getSystemColorScheme';
import { ColorSchemeStorage } from './color-scheme/useColorScheme';
import useContextColorScheme, { ColorSchemeProvider } from './color-scheme/useColorScheme/context';
import useGlobalColorScheme, { createColorSchemePrimitive } from './color-scheme/useColorScheme/global';
import useLocalStorage from './storage/useLocalStorage';
import use18n, { I18nProvider, addTranslations } from './i18n/useI18n';

export {
  addTranslations,
  I18nProvider,
  use18n,

  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet,
  createColorSchemePrimitive,
  getSystemColorScheme,
  useContextColorScheme,
  useGlobalColorScheme,

  useLocalStorage
}
