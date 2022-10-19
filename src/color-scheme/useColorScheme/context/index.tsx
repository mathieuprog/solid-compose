import type { ParentComponent, Signal } from 'solid-js';
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
  defaultScheme?: ColorScheme;
}

const ColorSchemeContext = createContext<ColorSchemePrimitive>();

export const ColorSchemeProvider: ParentComponent<Props> = (props) => {
  const mergedProps = mergeProps({ storage: ColorSchemeStorage.mediaQuery }, props);

  const [colorScheme, setColorScheme] =
    (typeof mergedProps.storage === 'function')
      ? mergedProps.storage(mergedProps.defaultScheme)
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
