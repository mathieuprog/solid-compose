import { createContext, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import { unique } from 'object-array-utils';
import { createTranslateFunction } from './createI18nPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import { defaultNamespace } from './registry';

interface Props {
  namespaces: string[];
}

interface I18nContextValue {
  translate: TranslateFunction;
  namespaces: string[];
}

const I18nContext = createContext<I18nContextValue>();

export const I18nProvider: ParentComponent<Props> = (props) => {
  let namespaces = [defaultNamespace, ...props.namespaces];

  const parentContextValue = useContext(I18nContext);

  if (parentContextValue) {
    namespaces = [...namespaces, ...parentContextValue.namespaces];
  }

  namespaces = unique(namespaces);

  const translate = createTranslateFunction(namespaces);

  return (
    <I18nContext.Provider value={{ translate, namespaces }}>
      {props.children}
    </I18nContext.Provider>
  );
}

export function useNamespacedI18n(): I18nContextValue | undefined {
  return useContext(I18nContext);
}
