import type { Accessor, Resource } from 'solid-js';
import AuthenticationStatus from './AuthenticationStatus';

export type CurrentUserPrimitive<T, U> = [Resource<T>, {
  authenticationStatus: Accessor<AuthenticationStatus>;
  authenticationError: Accessor<Error | null>;
  meta: U;
  refetchCurrentUser: any;
}];

let primitive: CurrentUserPrimitive<any, any>;

export function setPrimitive<T, U>(primitive_: CurrentUserPrimitive<T, U>) {
  primitive = primitive_;
}

export function getPrimitive<T, U>(): CurrentUserPrimitive<T, U> {
  return primitive;
}
