import { getPrimitive } from './globalPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import { useNamespacedI18n } from './context';

export default function useI18n(): TranslateFunction {
  let contextValue = useNamespacedI18n();

  if (contextValue) {
    return contextValue.translate;
  }

  const primitive = getPrimitive();

  if (!primitive) {
    throw new Error('call createI18nPrimitive(config) to create the global state');
  }

  return primitive;
}
