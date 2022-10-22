import type { ParentComponent } from 'solid-js';
import {
  createContext,
  mergeProps,
  useContext,
} from 'solid-js';
import useLocale from '@/locale/useLocale';
import {
  defaultNamespace,
  findFallbackLocale,
  findInTranslationList,
  getFallbackLocalesForMissingTranslations,
  getNestedTranslationsKeySeparator,
  mergeTranslations,
  TranslateFunction
} from '..';

interface Props {
  namespaces?: string[];
}

// provide a default value to avoid the | undefined part of the type
const defaultValue: TranslateFunction = (key, _params) => key;

const I18nContext = createContext<TranslateFunction>(defaultValue);

export const I18nProvider: ParentComponent<Props> = (props) => {
  const mergedProps =
    mergeProps({
      namespaces: [defaultNamespace]
    }, props);

  const [locale, _setLocale] = useLocale();

  const fallbackTranslations =
    getFallbackLocalesForMissingTranslations().map((locale) => {
      return mergeTranslations(locale, mergedProps.namespaces);
    });

  const fallbackLocale_ = () => findFallbackLocale(locale());

  const fallbackTranslations_ = () => {
    return (fallbackLocale_())
      ? mergeTranslations(fallbackLocale_() as string, mergedProps.namespaces)
      : {};
  };

  const translations = (): Record<string, any> => {
    return mergeTranslations(locale(), mergedProps.namespaces);
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

  return (
    <I18nContext.Provider value={translate}>
      {mergedProps.children}
    </I18nContext.Provider>
  );
}

export default function use18n(): TranslateFunction  {
  return useContext(I18nContext);
}
