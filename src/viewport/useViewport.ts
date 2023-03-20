import { getPrimitive } from './globalPrimitive';
import type { ViewportPrimitive } from './globalPrimitive';

export default function useViewport(): ViewportPrimitive {
  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createViewportPrimitive(config) to create the global state');
  }

  return primitive;
}
