import { getPrimitive } from './globalPrimitive';
import type { CurrentUserPrimitive } from './globalPrimitive';

export default function useCurrentUser<T, U extends Record<string, any> = {}>(): CurrentUserPrimitive<T, U> {
  const primitive = getPrimitive<T, U>();

  if (!primitive) {
    throw new Error('call createCurrentUserPrimitive(config) to create the global state');
  }

  return primitive;
}
