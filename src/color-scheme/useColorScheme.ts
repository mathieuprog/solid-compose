import { getPrimitive } from './globalPrimitive';
import type { ColorSchemePrimitive } from './globalPrimitive';

export default function useColorScheme(): ColorSchemePrimitive {
  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createColorSchemePrimitive(config) to create the global state');
  }

  return primitive;
}
