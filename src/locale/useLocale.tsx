import { getPrimitive } from './globalPrimitive';
import type { LocalePrimitive } from './globalPrimitive';

export default function useLocale(): LocalePrimitive {
  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createLocalePrimitive(config) to create the global state');
  }

  return primitive;
}
