import {
  createTranslateFunction,
  setGlobalPrimitiveCreated,
  TranslateFunction
} from '..';

let primitive: TranslateFunction;

export function createI18nPrimitive() {
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
