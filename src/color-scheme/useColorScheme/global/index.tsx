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
let defaultStorage: ColorSchemeStorage | Signal<ColorScheme> = ColorSchemeStorage.mediaQuery;

let primitive: ColorSchemePrimitive;

export function createColorSchemePrimitive(config?: Config) {
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

  primitive = [colorScheme, setColorScheme_];
}

export default function useColorScheme(): ColorSchemePrimitive {
  if (!primitive) {
    throw new Error('call createColorSchemePrimitive(config) to create the global state');
  }

  return primitive;
}
