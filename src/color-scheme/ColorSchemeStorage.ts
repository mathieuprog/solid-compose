import type { Accessor } from 'solid-js';
import { createSignal } from 'solid-js';
import getSystemColorScheme from './getSystemColorScheme';
import useLocalStorage from '@/storage/useLocalStorage';
import ColorScheme from './ColorScheme';

type ColorSchemeStorage = (defaultValue?: ColorScheme) => [Accessor<ColorScheme | null>, (colorScheme: ColorScheme) => void];

type ColorSchemeStorageDict = {
  [key: string]: ColorSchemeStorage;
};

const ColorSchemeStorage: ColorSchemeStorageDict = {
  mediaQuery: () => {
    return [getSystemColorScheme, () => { throw new Error() }];
  },
  localStorage: (defaultValue) => {
    const [colorScheme, { set: setColorScheme }] = useLocalStorage<ColorScheme>('__color-scheme', defaultValue || getSystemColorScheme());
    return [colorScheme, setColorScheme];
  },
  signalStorage: (defaultValue) => {
    return createSignal(defaultValue || getSystemColorScheme());
  },
  queryString: (defaultScheme) => {
    const get = () => {
      const queryString = new URLSearchParams(window.location.search);
      return queryString.get('color-scheme') as ColorScheme || defaultScheme || getSystemColorScheme();
    };

    const set = (colorScheme: ColorScheme) => {
      const queryString = new URLSearchParams(window.location.search);
      queryString.set('color-scheme', colorScheme);
      window.location.search = queryString.toString();
    };

    return [get, set];
  }
};

export default ColorSchemeStorage;
