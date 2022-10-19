import type { Signal } from 'solid-js';
import getSystemColorScheme from '../../getSystemColorScheme';
import {
  ColorSchemeStorage
} from '..';
import type {
  ColorScheme,
  ColorSchemePrimitive,
  ColorSchemeSetter
} from '..';

interface Config {
  storage?: ColorSchemeStorage | Signal<ColorScheme>;
  default?: ColorScheme;
}

let defaultScheme: ColorScheme = getSystemColorScheme();
let storage: ColorSchemeStorage | Signal<ColorScheme> = ColorSchemeStorage.mediaQuery;

let signal: ColorSchemePrimitive;

export function createColorSchemePrimitive(config: Config) {
  defaultScheme = config.default ?? defaultScheme;
  storage = config.storage ?? storage;

  const [colorScheme, setColorScheme] =
    (typeof storage === 'function')
      ? storage(defaultScheme)
      : storage;

  const setColorScheme_: ColorSchemeSetter = (arg) => {
    if (typeof arg === 'function') {
      setColorScheme(arg(colorScheme()));
    } else {
      setColorScheme(arg);
    }
  };

  signal = [colorScheme, setColorScheme_];
}

export default function useColorScheme(): ColorSchemePrimitive {
  return signal;
}
