import type { ParentComponent } from 'solid-js';
import {
  createContext,
  mergeProps,
  useContext,
} from 'solid-js';
import {
  createTranslateFunction,
  defaultNamespace,
  enableNestedTranslations,
  setFallbackLocalesForMissingTranslations,
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

  const translate = createTranslateFunction(mergedProps.namespaces);

  return (
    <I18nContext.Provider value={translate}>
      {mergedProps.children}
    </I18nContext.Provider>
  );
}

export default function use18n(): TranslateFunction  {
  return useContext(I18nContext);
}

interface Config {
  fallbackLocales?: string[];
  keySeparator?: string;
}

export function setupI18n(config?: Config) {
  if (config?.fallbackLocales !== undefined) {
    setFallbackLocalesForMissingTranslations(config?.fallbackLocales);
  }

  if (config?.keySeparator !== undefined) {
    enableNestedTranslations(config?.keySeparator || false);
  }
}
