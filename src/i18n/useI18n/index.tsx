type Registry = {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string
    }
  }
}

export type TranslateFunction = (key: string, params?: Record<string, any>) => string;

export const defaultNamespace = '__default';

let registry: Registry = {};

let globalPrimitiveCreated = false;

export function setGlobalPrimitiveCreated(created = true) {
  globalPrimitiveCreated = created;
}

let keySeparator: string | null = null;

let fallbackLocales: string[] = [];

export function setFallbackLocalesForMissingTranslations(locales: string[]) {
  if (globalPrimitiveCreated) {
    throw new Error('Cannot set fallback locales while global i18n has already been created');
  }

  fallbackLocales = locales;
}

export function getFallbackLocalesForMissingTranslations() {
  return fallbackLocales;
}

export function addTranslations(locale: string, translations: Record<string, any>): void;
export function addTranslations(locale: string, namespace: string, translations: Record<string, any>): void;
export function addTranslations(locale: string, namespaceOrTranslations: string | Record<string, any>, translations?: Record<string, any>): void {
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

// used to setup tests
export function removeAllTranslations() {
  registry = {};
  mergeTranslationsCache = {};
}

export function enableNestedTranslations(keySeparator_: string | false = '.') {
  if (globalPrimitiveCreated) {
    throw new Error('Cannot set key separator while global i18n has already been created');
  }

  keySeparator = (keySeparator_) ? keySeparator_ : null;
}

export function getNestedTranslationsKeySeparator() {
  return keySeparator;
}

let mergeTranslationsCache: Record<string, Record<string, any>> = {};

export function mergeTranslations(locale: string, namespaces?: string[]): Record<string, any> {
  if (namespaces === undefined) {
    return mergeAllTranslations(locale);
  }

  return mergeNamespacedTranslations(locale, namespaces);
}

function mergeAllTranslations(locale: string): Record<string, any> {
  let translations = {};

  if (registry[locale]) {
    translations = Object.entries(registry[locale])
      .map(([_, obj]) => obj)
      .reduce((acc, obj) => ({ ...acc, ...obj }) , {});
  }

  return translations;
}

function mergeNamespacedTranslations(locale: string, namespaces: string[]): Record<string, any> {
  const keyCache = `${locale}.${namespaces.join('.')}`;

  if (keyCache in mergeTranslationsCache) {
    return mergeTranslationsCache[keyCache];
  }

  let translations = {};

  if (registry[locale]) {
    translations = Object.entries(registry[locale])
      .filter(([namespace, _]) => namespaces.includes(namespace))
      .map(([_, obj]) => obj)
      .reduce((acc, obj) => ({ ...acc, ...obj }) , {});
  }

  mergeTranslationsCache[keyCache] = translations;

  return translations;
}

export function findInTranslationList(translationList: Record<string, any>[], key: string) {
  const translations = translationList.find((translations) => translations[key]);

  return (translations)
    ? translations[key]
    : null;
}

export function findFallbackLocale(locale: string) {
  if (!locale.includes('-')) {
    return null;
  }

  const fallbackLocale = locale.split('-')[0];

  return (registry[fallbackLocale])
    ? fallbackLocale
    : null;
}
