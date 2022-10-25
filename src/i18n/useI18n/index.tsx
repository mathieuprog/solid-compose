import useLocale from "@/locale/useLocale";

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

export function createTranslateFunction(namespaces?: string[]): TranslateFunction {
  const [locale, _setLocale] = useLocale();

  const fallbackTranslations =
    fallbackLocales.map((locale) => {
      return mergeTranslations(locale, namespaces);
    });

  const fallbackLocale_ = () => findFallbackLocale(locale());

  const fallbackTranslations_ = () => {
    return (fallbackLocale_())
      ? mergeTranslations(fallbackLocale_() as string, namespaces)
      : {};
  };

  const translations = (): Record<string, any> => {
    return mergeTranslations(locale(), namespaces);
  };

  return (key, params = {}) => {
    let value: string;

    if (keySeparator) {
      const splitKey = key.split(keySeparator);
      const firstKey = splitKey.shift() as string;

      const translationsObject: Record<string, any> =
        (translations()[firstKey] && translations())
          ?? (fallbackTranslations_()[firstKey] && fallbackTranslations_())
          ?? findInTranslationList(fallbackTranslations, firstKey)
          ?? (() => { throw new Error(`translation for "${firstKey}" not found`) })();

      let o = translationsObject[firstKey];

      while (splitKey.length > 0) {
        const k = splitKey.shift() as string;
        o = o[k] ?? (() => { throw new Error(`translation for "${key}" not found`) })();
      }

      value = o;
    } else {
      value =
        translations()[key]
        ?? fallbackTranslations_()[key]
        ?? findInTranslationList(fallbackTranslations, key)
        ?? fallbackTranslations.find((translations) => translations[key])
        ?? (() => { throw new Error(`translation for "${key}" not found`) })();
    }

    return value.replace(/{{(.*?)}}/g, (_: unknown, path: string): string => {
      const splitKey = path.trim().split('.');

      const value = splitKey.reduce((o, key) => {
        return o[key] ?? (() => { throw new Error(`translation for "${path}" not found`) })();
      }, params);

      if (typeof value !== 'string') {
        throw new Error(`translation for "${path}" not found`);
      }

      return value;
    });
  };
}

export function enableNestedTranslations(keySeparator_: string | false = '.') {
  if (globalPrimitiveCreated) {
    throw new Error('Cannot set key separator while global i18n has already been created');
  }

  keySeparator = (keySeparator_) ? keySeparator_ : null;
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
