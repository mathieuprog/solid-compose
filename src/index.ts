import {
  ColorScheme,
  DateEndianness,
  FirstDayOfWeek
} from 'user-locale';

import createLocalStoragePrimitive from './storage/createLocalStoragePrimitive';
import useLocalStorage from './storage/useLocalStorage';

import createI18nPrimitive from './i18n/createI18nPrimitive';
import useI18n from './i18n/useI18n';
import { addTranslations, getSupportedLanguageTags } from './i18n/registry';
import { I18nProvider, useNamespacedI18n } from './i18n/context';

import createLocalePrimitive from './locale/createLocalePrimitive';
import useLocale from './locale/useLocale';
import ColorSchemeStylesheet from './locale/ColorSchemeStylesheet';
import TextDirection from './locale/TextDirection';
import createTextDirectionEffect from './locale/createTextDirectionEffect';

import createViewportPrimitive from './viewport/createViewportPrimitive';
import useViewport from './viewport/useViewport';
import ViewportOrientation from './viewport/Orientation';

import createThemePrimitive from './theme/createThemePrimitive';
import useTheme from './theme/useTheme';
import ThemeStylesheet from './theme/ThemeStylesheet';

import { addLocaleHotkeyListener } from './developer';

export {
  createLocalStoragePrimitive,
  useLocalStorage,

  addTranslations,
  createI18nPrimitive,
  getSupportedLanguageTags,
  I18nProvider,
  useI18n,
  useNamespacedI18n,

  ColorScheme,
  ColorSchemeStylesheet,
  createLocalePrimitive,
  createTextDirectionEffect,
  DateEndianness,
  FirstDayOfWeek,
  TextDirection,
  useLocale,

  createViewportPrimitive,
  ViewportOrientation,
  useViewport,

  createThemePrimitive,
  ThemeStylesheet,
  useTheme,

  addLocaleHotkeyListener
}
