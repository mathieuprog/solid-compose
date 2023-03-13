import { createSignal } from 'solid-js';
import { ColorScheme } from 'user-locale';
import { setPrimitive } from './globalPrimitive';
import type { Setter } from './globalPrimitive';
import useLocale from '../locale/useLocale';
import { isEmptyObjectLiteral } from 'object-array-utils';
import { setThemes } from './themes';

export interface Themes {
  [key: string]: string;
}

interface ConfigWithRequiredInitialTheme {
  initialTheme: string;
  themes: Themes;
}

interface ConfigWithOptionalInitialTheme {
  initialTheme?: string;
  defaultDarkTheme: string;
  defaultLightTheme: string;
  themes: Themes;
}

type Config = ConfigWithRequiredInitialTheme | ConfigWithOptionalInitialTheme;

export default function createThemePrimitive(config: Config) {
  if (isEmptyObjectLiteral(config.themes)) {
    throw new Error(`no stylesheets provided`);
  }

  if (config.initialTheme && !config.themes[config.initialTheme]) {
    throw new Error(`stylesheet for theme ${config.initialTheme} not provided`);
  }

  if ('defaultDarkTheme' in config && !config.themes[config.defaultDarkTheme]) {
    throw new Error(`stylesheet for theme ${config.defaultDarkTheme} not provided`);
  }

  if ('defaultLightTheme' in config && !config.themes[config.defaultLightTheme]) {
    throw new Error(`stylesheet for theme ${config.defaultLightTheme} not provided`);
  }

  const [theme, setTheme] = createSignal(getDefaultTheme(config));

  const setTheme_: Setter<string> = (arg) => {
    const newTheme = (typeof arg === 'function') ? arg(theme()) : arg;

    if (!config.themes[newTheme]) {
      throw new Error(`stylesheet for theme ${newTheme} not provided`);
    }

    setTheme(newTheme);
  }

  setThemes(config.themes);

  setPrimitive([theme, setTheme_]);
}

function getDefaultTheme(config: Config) {
  if (config.initialTheme) {
    return config.initialTheme;
  }

  if ('defaultDarkTheme' in config) {
    const [locale] = useLocale();

    if (locale.colorScheme === ColorScheme.Dark) {
      return config.defaultDarkTheme;
    }

    return config.defaultLightTheme;
  }
  
  throw new Error();
}
