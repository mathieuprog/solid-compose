import { getPrimitive } from './globalPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import { useNamespacedI18n } from './context';

export default function useI18n(): TranslateFunction {
  let primitive = useNamespacedI18n();

  if (primitive) {
    return primitive;
  }

  primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createI18nPrimitive(config) to create the global state');
  }

  return primitive;
}
