import { getPrimitive } from './globalPrimitive';
import type { CurrentUserPrimitive } from './globalPrimitive';

export default function useCurrentUser<T>(): CurrentUserPrimitive<T> {
  const primitive = getPrimitive<T>();

  if (!primitive) {
    throw new Error('call createCurrentUserPrimitive(config) to create the global state');
  }

  return primitive;
}
