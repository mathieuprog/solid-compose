import useLocale from "@/locale/useLocale";
import {
  findFallbackLocale,
  findInTranslationList,
  getFallbackLocalesForMissingTranslations,
  getNestedTranslationsKeySeparator,
  mergeTranslations,
  setGlobalPrimitiveCreated,
  TranslateFunction
} from '..';

let primitive: TranslateFunction;

export function createI18nPrimitive() {
  const [locale, _setLocale] = useLocale();

  const fallbackTranslations =
    getFallbackLocalesForMissingTranslations().map((locale) => {
      return mergeTranslations(locale);
    });

  const fallbackLocale_ = () => findFallbackLocale(locale());

  const fallbackTranslations_ = () => {
    return (fallbackLocale_())
      ? mergeTranslations(fallbackLocale_() as string)
      : {};
  };

  const translations = () => {
    return mergeTranslations(locale());
  };

  const keySeparator = getNestedTranslationsKeySeparator();

  const translate: TranslateFunction = (key, _params = {}) => {
    if (keySeparator) {
      const splitKey = key.split(keySeparator);
      const firstKey = splitKey.shift() as string;

      const translationsObject =
        (translations()[firstKey] && translations())
          ?? (fallbackTranslations_()[firstKey] && fallbackTranslations_())
          ?? findInTranslationList(fallbackTranslations, firstKey)
          ?? (() => { throw new Error(`translation for "${firstKey}" not found`) })();

      let value = translationsObject[firstKey];

      while (splitKey.length > 0) {
        const key = splitKey.shift() as string;
        value = value[key] ?? (() => { throw new Error(`translation for "${key}" not found`) })();
      }

      return value;
    }

    return translations()[key]
        ?? fallbackTranslations_()[key]
        ?? findInTranslationList(fallbackTranslations, key)
        ?? fallbackTranslations.find((translations) => translations[key])
        ?? (() => { throw new Error(`translation for "${key}" not found`) })();
  };

  setGlobalPrimitiveCreated();

  primitive = translate;
}

export default function useI18n(): TranslateFunction {
  if (!primitive) {
    throw new Error('call createI18nPrimitive() to create the global state');
  }

  return primitive;
}
