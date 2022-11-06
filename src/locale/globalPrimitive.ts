import type { Accessor } from 'solid-js';

export type LocalePrimitive = [Accessor<string>, LocaleSetter];

export type LocaleSetter =
  ((locale: string) => void)
  & ((callback: ((prevLocale: string | null) => string)) => void);

let primitive: LocalePrimitive;

export function setPrimitive(primitive_: LocalePrimitive) {
  primitive = primitive_;
}

export function getPrimitive(): LocalePrimitive {
  return primitive;
}
