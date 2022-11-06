export type TranslateFunction = (key: string, params?: Record<string, any>) => string;

let primitive: TranslateFunction | null;

export function setPrimitive(primitive_: TranslateFunction | null) {
  primitive = primitive_;
}

export function getPrimitive(): TranslateFunction | null {
  return primitive;
}
