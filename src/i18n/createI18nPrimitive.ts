import {
  areArraysEqual,
  areObjectsEqual,
  isEmptyObjectLiteral,
  isObjectLiteral,
  rejectProperties
} from 'object-array-utils';
import { useLocale } from '..';
import { defaultNamespace } from './registry';
import { setPrimitive } from './globalPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import registry from './registry';

interface Config {
  fallbackLanguageTag?: string;
  keySeparator?: string;
}

let fallbackLanguageTag: string | null = null;
let keySeparator: string | null = null;

export default function createI18nPrimitive(config?: Config) {
  if (config?.keySeparator !== undefined) {
    keySeparator = config.keySeparator || null;
  }

  if (config?.fallbackLanguageTag !== undefined) {
    if (!Object.keys(registry).includes(config.fallbackLanguageTag)) {
      throw new Error(`no translations found for language ${config.fallbackLanguageTag}`);
    }
    fallbackLanguageTag = config.fallbackLanguageTag;
  }

  const [locale] = useLocale();

  if (!areArraysEqual(Object.keys(registry), locale.supportedLanguageTags)) {
    throw new Error('list of supported language tags doesn\'t match with language tags having translations');
  }

  setPrimitive(createTranslateFunction([defaultNamespace]));
}

export function createTranslateFunction(namespaces: string[]): TranslateFunction {
  const [locale] = useLocale();

  const fallbackTranslations =
    (fallbackLanguageTag)
      ? mergeTranslations(fallbackLanguageTag, namespaces)
      : {};

  const fallbackLanguageTag_ = () => findFallbackLanguageTag(locale.languageTag);

  const fallbackTranslations_ = () => {
    return (fallbackLanguageTag_())
      ? mergeTranslations(fallbackLanguageTag_() as string, namespaces)
      : {};
  };

  const translations = (): Record<string, any> => {
    return mergeTranslations(locale.languageTag, namespaces);
  };

  return (key, params = {}) => {
    let value: string;

    if (keySeparator) {
      const splitKey = key.split(keySeparator);
      const firstKey = splitKey.shift() as string;

      const translationsObject: Record<string, any> =
        (translations()[firstKey] && translations())
          ?? (fallbackTranslations_()[firstKey] && fallbackTranslations_())
          ?? (fallbackTranslations[firstKey] && fallbackTranslations)
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
        ?? fallbackTranslations[key]
        ?? (() => { throw new Error(`translation for "${key}" not found`) })();
    }

    let paramsUsed: Record<string, any> = {};

    let isPlural = false;

    if (isObjectLiteral(value)) {
      const pluralTranslations: Record<string, string> = value as any;

      const rejectedProps = rejectProperties(pluralTranslations, ['zero', 'one', 'two', 'few', 'many', 'other']);
      if (!isEmptyObjectLiteral(rejectedProps)) {
        throw new Error(`invalid keys "${JSON.stringify(rejectedProps)}"`);
      }

      const cardinal = params['cardinal'];
      const ordinal = params['ordinal'];
      if (!cardinal && !ordinal) {
        throw new Error('cardinal or ordinal parameter not found');
      }
      if (cardinal && ordinal) {
        throw new Error('cannot use both cardinal and ordinal parameters');
      }

      const count = cardinal || ordinal;

      const pluralRule = new Intl.PluralRules(locale.languageTag).select(count);

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

          return params[key] ?? (() => { throw new Error(`value for parameter "${path}" not found`) })();
        }, params);

        if (typeof value !== 'string' && typeof value !== 'number') {
          (value === undefined)
            ? (() => { throw new Error(`value for parameter "${path}" not found`) })()
            : (() => { throw new Error(`invalid value for parameter "${path}": ${value}`) })();
        }

        return value;
      });

    if (isPlural) {
      if ('cardinal' in params) {
        paramsUsed.cardinal = params.cardinal;
      }
      if ('ordinal' in params) {
        paramsUsed.ordinal = params.ordinal;
      }
    }

    if (!areObjectsEqual(params, paramsUsed)) {
      throw new Error(`too many parameters passed "${JSON.stringify(params)}"`);
    }

    return value;
  };
}

function findFallbackLanguageTag(locale: string) {
  if (!locale.includes('-')) {
    return null;
  }

  const fallbackLanguageTag = locale.split('-')[0];

  return (registry[fallbackLanguageTag])
    ? fallbackLanguageTag
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
