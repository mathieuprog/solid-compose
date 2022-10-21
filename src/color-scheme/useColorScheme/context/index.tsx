import type { ParentComponent, Signal } from 'solid-js';
import getSystemColorScheme from '../../getSystemColorScheme';
import {
  createContext,
  mergeProps,
  useContext
} from 'solid-js';
import {
  ColorSchemeStorage
} from '..';
import type {
  ColorScheme,
  ColorSchemePrimitive,
  ColorSchemeSetter
} from '..';

interface Props {
  storage?: ColorSchemeStorage | Signal<ColorScheme>;
  default?: ColorScheme;
}

const ColorSchemeContext = createContext<ColorSchemePrimitive>();

export const ColorSchemeProvider: ParentComponent<Props> = (props) => {
  const mergedProps =
    mergeProps({
      storage: ColorSchemeStorage.mediaQuery,
      default: getSystemColorScheme()
    }, props);

  const [colorScheme, setColorScheme] =
    (typeof mergedProps.storage === 'function')
      ? mergedProps.storage(mergedProps.default)
      : mergedProps.storage;

  const setColorScheme_: ColorSchemeSetter = (arg) => {
    if (typeof arg === 'function') {
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

export default function useColorScheme(): ColorSchemePrimitive | undefined {
  return useContext(ColorSchemeContext);
}
