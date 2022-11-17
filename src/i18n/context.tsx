import { createContext, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import { createTranslateFunction } from './createI18nPrimitive';
import type { TranslateFunction } from './globalPrimitive';
import { defaultNamespace } from './registry';

interface Props {
  namespaces: string[];
}

const I18nContext = createContext<TranslateFunction>();

export const I18nProvider: ParentComponent<Props> = (props) => {
  const namespaces = [defaultNamespace, ...props.namespaces];

  const translate = createTranslateFunction(namespaces);

  return (
    <I18nContext.Provider value={translate}>
      {props.children}
    </I18nContext.Provider>
  );
}

export function useNamespacedI18n(): TranslateFunction | undefined {
  return useContext(I18nContext);
}
