import { areObjectsEqual, isEmptyObjectLiteral, isObjectLiteral, rejectProperties } from 'object-array-utils';
import { useLocale } from '..';
import { defaultNamespace } from './addTranslations';
import { setPrimitive } from './globalPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import registry from './registry';

interface Config {
  fallbackLocales?: string[];
  keySeparator?: string;
}

let keySeparator: string | null = null;

let fallbackLocales: string[] = [];

export default function createI18nPrimitive(config?: Config) {
  if (config?.fallbackLocales !== undefined) {
    fallbackLocales = config?.fallbackLocales;
  }

  if (config?.keySeparator !== undefined) {
    keySeparator = config?.keySeparator || null;
  }

  setPrimitive(createTranslateFunction([defaultNamespace]));
}

export function createTranslateFunction(namespaces: string[]): TranslateFunction {
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

    let paramsUsed: Record<string, any> = {};

    let isPlural = false;

    if (isObjectLiteral(value)) {
      const pluralTranslations: Record<string, string> = value as any;

      const rejectedProps = rejectProperties(pluralTranslations, ['zero', 'one', 'two', 'few', 'many', 'other']);
      if (!isEmptyObjectLiteral(rejectedProps)) {
        throw new Error(`Invalid keys "${JSON.stringify(rejectedProps)}"`);
      }

      const count = params['count'];
      if (!count) {
        throw new Error('count parameter not found');
      }

      const pluralRule = new Intl.PluralRules(locale()).select(count);

      value = pluralTranslations[pluralRule];
      if (!value) {
        throw new Error(`message for plural rule "${pluralRule}" not found`);
      }

      isPlural = true;
    }

    value =
      value.replace(/{{(.*?)}}/g, (_: unknown, path: string): string => {
        let paramsUsed_ = paramsUsed;

        path = path.trim();
        const splitKey = path.split('.');

        const value = splitKey.reduce((params, key) => {
          paramsUsed_[key] = isObjectLiteral(params[key]) ? (paramsUsed_[key] ?? {}) : params[key];
          paramsUsed_ = paramsUsed_[key];

          return params[key] ?? (() => { throw new Error(`translation for parameter "${path}" not found`) })();
        }, params);

        if (typeof value !== 'string') {
          throw new Error(`translation for parameter "${path}" not found`);
        }

        return value;
      });

    if (isPlural) {
      paramsUsed.count = params.count;
    }

    if (!areObjectsEqual(params, paramsUsed)) {
      throw new Error(`too many parameters passed "${JSON.stringify(params)}"`);
    }

    return value;
  };
}

function findInTranslationList(translationList: Record<string, any>[], key: string) {
  const translations = translationList.find((translations) => translations[key]);

  return (translations)
    ? translations[key]
    : null;
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

let mergeTranslationsCache: Record<string, Record<string, any>> = {};

function mergeTranslations(locale: string, namespaces: string[]): Record<string, any> {
  const keyCache = `${locale}.${namespaces.join('.')}`;

  if (keyCache in mergeTranslationsCache) {
    return mergeTranslationsCache[keyCache];
  }

  let translations = {};

  if (registry[locale]) {
    translations =
      namespaces.reduce((translations, namespace) => {
        if (!registry[locale][namespace]) {
          return translations;
        }

        return {
          ...translations,
          ...registry[locale][namespace]
        };
      }, {});
  }

  mergeTranslationsCache[keyCache] = translations;

  return translations;
}

// used to setup tests
export function removeAllTranslations() {
  Object.keys(registry).forEach(key => delete registry[key]);
  mergeTranslationsCache = {};
}
