import { createEffect, createRoot, createSignal } from 'solid-js';
import type { Resource } from 'solid-js';
import { setPrimitive } from './globalPrimitive';

interface Config<T> {
  getCurrentUserResource: () => Resource<T>;
  isUnauthenticatedError: (error: any) => boolean;
  isAuthenticated: (data: T) => boolean;
}

export default function createCurrentUserPrimitive<T>(config: Config<T>) {
  createRoot(() => {
    const [authenticated, setAuthenticated] = createSignal(false);
    const [isUnauthenticatedError, setIsUnauthenticatedError] = createSignal(false);

    const currentUser = config.getCurrentUserResource();

    createEffect(() => {
      if (currentUser.state === 'errored') {
        if (config.isUnauthenticatedError(currentUser.error)) {
          setIsUnauthenticatedError(true);
        } else {
          throw currentUser.error;
        }
      } else if (currentUser.state === 'ready' && config.isAuthenticated(currentUser())) {
        setAuthenticated(true);
      }
    });

    setPrimitive<T>([currentUser, { authenticated, isUnauthenticatedError }]);
  });
}
