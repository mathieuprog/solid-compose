import { getPrimitive } from './globalPrimitive';
import type { ThemePrimitive } from './globalPrimitive';

export default function useTheme(): ThemePrimitive {
  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createThemePrimitive(config) to create the global state');
  }

  return primitive;
}
