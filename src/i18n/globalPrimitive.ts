export type TranslateOptions = {
  languageTag?: string;
  namespace?: string;
}

export type TranslateFunction = (
    key: string,
    params?: Record<string, any>,
    languageTagOrOptions?: string | null | TranslateOptions,
    namespace?: string
  ) => string;

let primitive: TranslateFunction;

export function setPrimitive(primitive_: TranslateFunction) {
  primitive = primitive_;
}

export function getPrimitive(): TranslateFunction {
  return primitive;
}
