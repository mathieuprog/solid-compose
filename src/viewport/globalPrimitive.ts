export type ViewportPrimitive = {
  orientation?: string;
  height?: string;
  width?: string;
};

let primitive: ViewportPrimitive;

export function setPrimitive(primitive_: ViewportPrimitive) {
  primitive = primitive_;
}

export function getPrimitive(): ViewportPrimitive {
  return primitive;
}
