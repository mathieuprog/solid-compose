import type { Accessor, Resource } from 'solid-js';

export type CurrentUserPrimitive<T> = [Resource<T>, {
  authenticated: Accessor<boolean>;
  isUnauthenticatedError: Accessor<boolean>;
}];

let primitive: CurrentUserPrimitive<any>;

export function setPrimitive<T>(primitive_: CurrentUserPrimitive<T>) {
  primitive = primitive_;
}

export function getPrimitive<T>(): CurrentUserPrimitive<T> {
  return primitive;
}
