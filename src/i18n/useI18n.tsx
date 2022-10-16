import type { ParentComponent } from 'solid-js';
import {
  createContext,
  createSignal,
  mergeProps,
  useContext,
} from 'solid-js';
import getDefaultLocale from './getDefaultLocale';

type Registry = {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string
    }
  }
}

interface Props {
  locale?: string;
  fallbackLocale?: string;
  namespaces?: string[];
}

type TranslateFunction = (key: string, params?: Record<string, any>) => string;
type GetOrChangeLocaleFunction = (locale?: string) => string | undefined;

type I18nContext = [TranslateFunction, GetOrChangeLocaleFunction];

const defaultNamespace = '__default';

let registry: Registry = {};

let mergeTranslationsCache: Record<string, Record<string, any>> = {};

let keySeparator: string | null = null;

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
  keySeparator = (keySeparator_) ? keySeparator_ : null;
}

// provide a default value to avoid the | undefined part of the type
const defaultValue: I18nContext = [(key, _params) => key, () => { throw new Error() }];

const I18nContext = createContext<I18nContext>(defaultValue);

export const I18nProvider: ParentComponent<Props> = (props) => {
  const mergedProps =
    mergeProps({
      locale: getDefaultLocale(),
      fallbackLocale: getDefaultLocale(),
      namespaces: [defaultNamespace]
    }, props);

  const [locale, setLocale] = createSignal(mergedProps.locale);

  const englishLocale = findEnglishLocale();

  const englishTranslations =
    (englishLocale)
      ? mergeTranslations(englishLocale, mergedProps.namespaces)
      : {};

  const fallbackTranslations =
    (mergedProps.fallbackLocale)
      ? mergeTranslations(mergedProps.fallbackLocale, mergedProps.namespaces)
      : {};

  const fallbackLocale_ = () => findFallbackLocale(locale());

  const fallbackTranslations_ = () => {
    return (fallbackLocale_())
      ? mergeTranslations(fallbackLocale_() as string, mergedProps.namespaces)
      : {};
  };

  const translations = () => {
    return mergeTranslations(locale(), mergedProps.namespaces);
  };

  const translate: TranslateFunction = (key, _params = {}) => {
    if (keySeparator) {
      const splitKey = key.split('.');
      const firstKey = splitKey.shift() as string;

      const translationsObject =
        (translations()[firstKey] && translations())
          ?? (fallbackTranslations_()[firstKey] && fallbackTranslations_())
          ?? (fallbackTranslations[firstKey] && fallbackTranslations)
          ?? (englishTranslations[firstKey] && englishTranslations)
          ?? (() => { throw new Error('translation not found') })();

      let value = translationsObject[firstKey];

      while (splitKey.length > 0) {
        const key = splitKey.shift() as string;
        value = value[key] ?? (() => { throw new Error('translation not found') })();
      }

      return value;
    }

    return translations()[key]
        ?? fallbackTranslations_()[key]
        ?? fallbackTranslations[key]
        ?? englishTranslations[key]
        ?? (() => { throw new Error('translation not found') })();
  };

  const getOrChangeLocale: GetOrChangeLocaleFunction = (locale_) => {
    if (typeof locale_ === 'undefined') {
      return locale();
    }

    setLocale(locale_);
  };

  return (
    <I18nContext.Provider value={[translate, getOrChangeLocale]}>
      {mergedProps.children}
    </I18nContext.Provider>
  );
}

export default function use18n(): I18nContext  {
  return useContext(I18nContext);
}

function mergeTranslations(locale: string, namespaces: string[]) {
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

function findFallbackLocale(locale: string) {
  if (!locale.includes('-')) {
    return null;
  }

  const fallbackLocale = locale.split('-')[0];

  return (registry[fallbackLocale])
    ? fallbackLocale
    : null;
}

function findEnglishLocale() {
  if (registry['en']) {
    return 'en';
  }

  if (registry['en-US']) {
    return 'en-US';
  }

  if (registry['en-GB']) {
    return 'en-GB';
  }

  return Object.keys(registry).find((locale) => {
    return locale.startsWith('en-');
  });
}
