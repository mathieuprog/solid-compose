import type { Accessor } from 'solid-js';
import ColorScheme from './ColorScheme';

export type ColorSchemePrimitive = [Accessor<ColorScheme | null>, ColorSchemeSetter];

export type ColorSchemeSetter =
  ((colorScheme: ColorScheme) => void)
  & ((callback: ((prevColorScheme: ColorScheme | null) => ColorScheme)) => void);

let primitive: ColorSchemePrimitive;

export function setPrimitive(primitive_: ColorSchemePrimitive) {
  primitive = primitive_;
}

export function getPrimitive(): ColorSchemePrimitive {
  return primitive;
}
