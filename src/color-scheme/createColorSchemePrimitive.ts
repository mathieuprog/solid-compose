import type { Signal } from 'solid-js';
import getSystemColorScheme from './getSystemColorScheme';
import { setPrimitive } from './globalPrimitive';
import type { ColorSchemeSetter } from './globalPrimitive';
import ColorScheme from './ColorScheme';
import ColorSchemeStorage from './ColorSchemeStorage';

interface Config {
  storage?: ColorSchemeStorage | Signal<ColorScheme>;
  default?: ColorScheme;
}

let defaultScheme: ColorScheme = getSystemColorScheme();
let defaultStorage: ColorSchemeStorage | Signal<ColorScheme> = ColorSchemeStorage.mediaQuery;

export default function createColorSchemePrimitive(config?: Config) {
  defaultScheme = config?.default ?? defaultScheme;
  const storage = config?.storage ?? defaultStorage;

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

  setPrimitive([colorScheme, setColorScheme_]);
}
