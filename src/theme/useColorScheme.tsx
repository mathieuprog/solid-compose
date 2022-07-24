import {
  Accessor,
  createContext,
  mergeProps,
  ParentComponent,
  useContext,
} from 'solid-js';
import getSystemColorScheme from './getSystemColorScheme';
import useLocalStorage from '../storage/useLocalStorage';

export type ColorScheme = 'light' | 'dark';

export interface ColorSchemeStore {
  get: () => ColorScheme;
  set: (colorScheme: ColorScheme) => void;
}

interface Props {
  storage?: ColorSchemeStorage;
}

export type ColorSchemeStorage = () => [Accessor<ColorScheme | null>, (colorScheme: ColorScheme) => void];

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
  localStorage: () => {
    const systemColorScheme = getSystemColorScheme();
    const [colorScheme, { set: setColorScheme }] = useLocalStorage<ColorScheme>('__color-scheme', systemColorScheme);
    return [colorScheme, setColorScheme];
  }
};

const defaultValue: ColorSchemeContext = [() => 'light', () => { throw new Error() }];

const ColorSchemeContext = createContext<ColorSchemeContext>(defaultValue);

export const ColorSchemeProvider: ParentComponent<Props> = (props) => {
  const mergedProps = mergeProps({ storage: ColorSchemeStorage.mediaQuery }, props);

  const [colorScheme, setColorScheme] = mergedProps.storage();

  const setColorScheme_: ColorSchemeSetter = (arg: ColorScheme | ((colorScheme: ColorScheme | null) => ColorScheme)): void => {
    if(typeof arg === "function") {
      setColorScheme(arg(colorScheme()))
    } else {
      setColorScheme(arg);
    }
  };

  return (
    <ColorSchemeContext.Provider value={[colorScheme, setColorScheme_]}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
}

export default function useColorScheme(): ColorSchemeContext  {
  return useContext(ColorSchemeContext);
}