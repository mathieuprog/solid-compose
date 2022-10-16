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

const registry: Registry = {};

interface Props {
  locale?: string;
  fallbackLocale?: string;
  namespaces: string[];
}

type TranslateFunction = (key: string, params?: Record<string, string>) => string;
type GetOrChangeLocaleFunction = (locale?: string) => string | undefined;

type I18nContext = [TranslateFunction, GetOrChangeLocaleFunction];

export function addTranslations(locale: string, namespace: string, translations: Record<string, string>) {
  registry[locale] ??= {};
  registry[locale][namespace] ??= {};
  registry[locale][namespace] = translations;
}

// provide a default value to avoid the | undefined part of the type
const defaultValue: I18nContext = [(key, _params) => key, () => { throw new Error() }];

const I18nContext = createContext<I18nContext>(defaultValue);

export const I18nProvider: ParentComponent<Props> = (props) => {
  const mergedProps =
    mergeProps({
      locale: getDefaultLocale(),
      fallbackLocale: getDefaultLocale()
    }, props);

  const [locale, setLocale] = createSignal(mergedProps.locale);

  const englishLocale = findEnglishLocale();

  const englishTranslations =
    (englishLocale)
      ? mergeTranslationsFromNamespaces(englishLocale, mergedProps.namespaces)
      : {};

  const fallbackTranslations =
    (mergedProps.fallbackLocale)
      ? mergeTranslationsFromNamespaces(mergedProps.fallbackLocale, mergedProps.namespaces)
      : {};

  const fallbackLocale_ = () => findFallbackLocale(locale());

  const fallbackTranslations_ = () => {
    return (fallbackLocale_())
      ? mergeTranslationsFromNamespaces(fallbackLocale_() as string, mergedProps.namespaces)
      : {};
  };

  const translations = () => {
    return mergeTranslationsFromNamespaces(locale(), mergedProps.namespaces);
  };

  const translate: TranslateFunction = (key, _params = {}) => {
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

function mergeTranslationsFromNamespaces(locale: string, namespaces: string[]) {
  if (!registry[locale]) {
    return {};
  }

  return Object.entries(registry[locale])
    .filter(([namespace, _]) => namespaces.includes(namespace))
    .map(([_, obj]) => obj)
    .reduce((acc, obj) => ({ ...acc, ...obj }) , {});
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
