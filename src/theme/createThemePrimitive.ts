import { createSignal } from 'solid-js';
import { ColorScheme } from 'user-locale';
import { isEmptyArray } from 'object-array-utils';
import { setPrimitive } from './globalPrimitive';
import type { Setter } from './globalPrimitive';
import useLocale from '../locale/useLocale';
import { setThemes } from './themes';

export interface Theme {
  name: string;
  path: string;
  colorScheme: ColorScheme;
  default?: boolean;
}

interface Config {
  initialTheme?: string;
  themes: Theme[];
}

export default function createThemePrimitive(config: Config) {
  if (isEmptyArray(config.themes)) {
    throw new Error(`no stylesheets provided`);
  }

  const [theme, setTheme] = createSignal(getDefaultTheme(config));

  const setTheme_: Setter<string> = (arg) => {
    const newTheme = (typeof arg === 'function') ? arg(theme()) : arg;

    if (!config.themes.find((theme) => theme.name === newTheme)) {
      throw new Error(`stylesheet for theme ${newTheme} not provided`);
    }

    setTheme(newTheme);
  }

  setThemes(config.themes);

  setPrimitive([theme, setTheme_]);
}

function getDefaultTheme(config: Config) {
  if (config.initialTheme) {
    if (!config.themes.some((theme) => theme.name === config.initialTheme)) {
      throw new Error(`stylesheet for theme ${config.initialTheme} not provided`);
    }

    return config.initialTheme;
  }

  const defaultDarkThemes = config.themes.filter((theme) => theme.default && theme.colorScheme === ColorScheme.Dark);
  if (defaultDarkThemes.length < 1) {
    throw new Error('no default dark theme specified');
  }
  if (defaultDarkThemes.length > 1) {
    throw new Error('specify only one default dark theme');
  }

  const defaultLightThemes = config.themes.filter((theme) => theme.default && theme.colorScheme === ColorScheme.Light);
  if (defaultLightThemes.length < 1) {
    throw new Error('no default light theme specified');
  }
  if (defaultLightThemes.length > 1) {
    throw new Error('specify only one default light theme');
  }

  const [locale] = useLocale();

  if (locale.colorScheme === ColorScheme.Dark) {
    return defaultDarkThemes[0].name;
  }

  return defaultLightThemes[0].name;
}
