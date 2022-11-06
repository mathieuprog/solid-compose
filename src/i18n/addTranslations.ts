import { getPrimitive } from './globalPrimitive';
import registry from './registry';

export const defaultNamespace = '__default';

export default function addTranslations(locale: string, translations: Record<string, any>): void;
export default function addTranslations(locale: string, namespace: string, translations: Record<string, any>): void;
export default function addTranslations(locale: string, namespaceOrTranslations: string | Record<string, any>, translations?: Record<string, any>): void {
  if (getPrimitive()) {
    throw new Error('translations added after the createI18nPrimitive(config) call');
  }
  
  let namespace: string;

  if (typeof namespaceOrTranslations === 'string') {
    namespace = namespaceOrTranslations;
  } else {
    namespace = defaultNamespace;
    translations = namespaceOrTranslations;
  }

  registry[locale] ??= {};
  registry[locale][namespace] ??= {};

  const collidingKeys = commonKeys(registry[locale][namespace], translations);
  if (collidingKeys.length > 0) {
    throw new Error(`colliding keys: ${collidingKeys.join(', ')}`);
  }

  registry[locale][namespace] = {
    ...registry[locale][namespace],
    ...translations as Record<string, any>
  };
}

function commonKeys(a: any, b: any) {
  return Object.keys(a).filter(function (key) { 
      return b.hasOwnProperty(key); 
  });
};
