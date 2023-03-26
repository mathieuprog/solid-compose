export type TranslateFunction = (key: string, params?: Record<string, any>, languageTag?: string) => string;

let primitive: TranslateFunction;

export function setPrimitive(primitive_: TranslateFunction) {
  primitive = primitive_;
}

export function getPrimitive(): TranslateFunction {
  return primitive;
}
