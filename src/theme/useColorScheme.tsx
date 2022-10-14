import type { Accessor, ParentComponent, Signal } from 'solid-js';
import {
  createContext,
  createSignal,
  mergeProps,
  useContext
} from 'solid-js';
import getSystemColorScheme from './getSystemColorScheme';
import useLocalStorage from '../storage/useLocalStorage';

export type ColorScheme = 'light' | 'dark';

export interface ColorSchemeStore {
  get: () => ColorScheme;
  set: (colorScheme: ColorScheme) => void;
}

interface Props {
  storage?: ColorSchemeStorage | Signal<ColorScheme>;
  defaultScheme?: ColorScheme;
}

export type ColorSchemeStorage = (defaultValue?: ColorScheme) => [Accessor<ColorScheme | null>, (colorScheme: ColorScheme) => void];

type ColorSchemeStorageDict = {
  [key: string]: ColorSchemeStorage;
};

type ColorSchemeContext = [Accessor<ColorScheme | null>, ColorSchemeSetter];

type ColorSchemeSetter =
  ((colorScheme: ColorScheme) => void)
  & ((callback: ((prevColorScheme: ColorScheme | null) => ColorScheme)) => void);

export const ColorSchemeStorage: ColorSchemeStorageDict = {
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

// provide a default value to avoid the | undefined part of the type
const defaultValue: ColorSchemeContext = [() => 'light', () => { throw new Error() }];

const ColorSchemeContext = createContext<ColorSchemeContext>(defaultValue);

export const ColorSchemeProvider: ParentComponent<Props> = (props) => {
  const mergedProps = mergeProps({ storage: ColorSchemeStorage.mediaQuery }, props);

  const [colorScheme, setColorScheme] =
    (typeof mergedProps.storage === 'function')
      ? mergedProps.storage(mergedProps.defaultScheme)
      : mergedProps.storage;

  const setColorScheme_: ColorSchemeSetter = (arg) => {
    if(typeof arg === 'function') {
      setColorScheme(arg(colorScheme()));
    } else {
      setColorScheme(arg);
    }
  };

  return (
    <ColorSchemeContext.Provider value={[colorScheme, setColorScheme_]}>
      {mergedProps.children}
    </ColorSchemeContext.Provider>
  );
}

export default function useColorScheme(): ColorSchemeContext  {
  return useContext(ColorSchemeContext);
}
