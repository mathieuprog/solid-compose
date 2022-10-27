import {
  createTranslateFunction,
  enableNestedTranslations,
  setFallbackLocalesForMissingTranslations,
  setGlobalPrimitiveCreated,
  TranslateFunction
} from '..';

interface Config {
  fallbackLocales?: string[];
  keySeparator?: string;
}

let primitive: TranslateFunction;

export function createI18nPrimitive(config?: Config) {
  if (config?.fallbackLocales !== undefined) {
    setFallbackLocalesForMissingTranslations(config?.fallbackLocales);
  }

  if (config?.keySeparator !== undefined) {
    enableNestedTranslations(config?.keySeparator || false);
  }

  const translate = createTranslateFunction();

  setGlobalPrimitiveCreated();

  primitive = translate;
}

export default function useI18n(): TranslateFunction {
  if (!primitive) {
    throw new Error('call createI18nPrimitive() to create the global state');
  }

  return primitive;
}
