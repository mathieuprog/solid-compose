import { getPrimitive } from './globalPrimitive';
import type { TranslateFunction } from './globalPrimitive';

export default function useI18n(): TranslateFunction {
  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createI18nPrimitive(config) to create the global state');
  }

  return primitive;
}
