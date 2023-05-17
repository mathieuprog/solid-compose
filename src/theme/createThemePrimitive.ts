import { batch, createSignal } from 'solid-js';
import { ColorScheme } from 'user-locale';
import { isEmptyArray } from 'object-array-utils';
import useLocale from '../locale/useLocale';
import { setPrimitive } from './globalPrimitive';
import type { Setter } from './globalPrimitive';
import { setThemes } from './themes';

export interface Theme {
  name: string;
  path?: string;
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

  const defaultThemeInfo = getDefaultTheme(config);

  const [theme, setTheme] = createSignal(defaultThemeInfo.name);

  const [_locale, { setColorScheme }] = useLocale();

  setColorScheme(defaultThemeInfo.colorScheme);

  const setTheme_: Setter<string> = (arg) => {
    const newTheme = (typeof arg === 'function') ? arg(theme()) : arg;

    const newThemeInfo = config.themes.find((theme) => theme.name === newTheme);

    if (!newThemeInfo) {
      throw new Error(`stylesheet for theme ${newTheme} not provided`);
    }

    batch(() => {
      setColorScheme(newThemeInfo.colorScheme);
      setTheme(newTheme);
    });
  }

  setThemes(config.themes);

  setPrimitive([theme, setTheme_]);
}

function getDefaultTheme(config: Config): Theme {
  if (config.initialTheme) {
    const themeInfo = config.themes.find((theme) => theme.name === config.initialTheme);

    if (!themeInfo) {
      throw new Error(`stylesheet for theme ${config.initialTheme} not provided`);
    }

    return themeInfo;
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
    return defaultDarkThemes[0];
  }

  return defaultLightThemes[0];
}
