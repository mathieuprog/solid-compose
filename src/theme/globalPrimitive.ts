import type { Accessor } from 'solid-js';

export type Setter<T> =
  ((value: T) => void)
  & ((callback: ((prevValue: T) => T)) => void);

export type ThemePrimitive = [Accessor<string>, Setter<string>];

let primitive: ThemePrimitive;

export function setPrimitive(primitive_: ThemePrimitive) {
  primitive = primitive_;
}

export function getPrimitive(): ThemePrimitive {
  return primitive;
}
