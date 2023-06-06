import type { Accessor, Resource } from 'solid-js';
import AuthenticationStatus from './AuthenticationStatus';

export type CurrentUserPrimitive<T> = [Resource<T>, {
  authenticationStatus: Accessor<AuthenticationStatus>;
  refetch: any;
}];

let primitive: CurrentUserPrimitive<any>;

export function setPrimitive<T>(primitive_: CurrentUserPrimitive<T>) {
  primitive = primitive_;
}

export function getPrimitive<T>(): CurrentUserPrimitive<T> {
  return primitive;
}
