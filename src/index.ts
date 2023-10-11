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

import createColorSchemeEffect from './locale/createColorSchemeEffect';
import createLocalePrimitive from './locale/createLocalePrimitive';
import useLocale from './locale/useLocale';
import ColorSchemeStylesheet from './locale/ColorSchemeStylesheet';
import TextDirection from './locale/TextDirection';
import createTextDirectionEffect from './locale/createTextDirectionEffect';
import parseNumber from './locale/parseNumber';
import formatNumber from './locale/formatNumber';
import formatDate from './locale/formatDate';
import formatTime from './locale/formatTime';

import createViewportPrimitive from './viewport/createViewportPrimitive';
import useViewport from './viewport/useViewport';
import createViewportEffect from './viewport/createViewportEffect';
import ViewportOrientation from './viewport/Orientation';

import AuthenticationStatus from './current-user/AuthenticationStatus';
import createCurrentUserPrimitive from './current-user/createCurrentUserPrimitive';
import useCurrentUser from './current-user/useCurrentUser';

import createThemeEffect from './theme/createThemeEffect';
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
  createColorSchemeEffect,
  createLocalePrimitive,
  createTextDirectionEffect,
  DateEndianness,
  FirstDayOfWeek,
  parseNumber,
  formatNumber,
  formatDate,
  formatTime,
  TextDirection,
  useLocale,

  AuthenticationStatus,
  createCurrentUserPrimitive,
  useCurrentUser,

  createViewportPrimitive,
  createViewportEffect,
  ViewportOrientation,
  useViewport,

  createThemeEffect,
  createThemePrimitive,
  ThemeStylesheet,
  useTheme,

  addLocaleHotkeyListener
}
