import registry from './registry';

const defaultNamespace = '__default';

export default function addTranslations(locale: string, translations: Record<string, any>): void;
export default function addTranslations(locale: string, namespace: string, translations: Record<string, any>): void;
export default function addTranslations(locale: string, namespaceOrTranslations: string | Record<string, any>, translations?: Record<string, any>): void {
  let namespace: string;

  if (typeof namespaceOrTranslations === 'string') {
    namespace = namespaceOrTranslations;
  } else {
    namespace = defaultNamespace;
    translations = namespaceOrTranslations;
  }

  registry[locale] ??= {};
  registry[locale][namespace] ??= {};
  registry[locale][namespace] = translations as Record<string, any>;
}
