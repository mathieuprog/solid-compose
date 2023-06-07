import { createEffect, createRoot, createSignal } from 'solid-js';
import type { Resource } from 'solid-js';
import { setPrimitive } from './globalPrimitive';
import AuthenticationStatus from './AuthenticationStatus';

type Refetch<T> = (info?: unknown) => T | Promise<T | undefined> | null | undefined;

interface Config<T> {
  createCurrentUserResource: () => [Resource<T>, { refetch: Refetch<T> }];
  isUnauthenticatedError: (error: any) => boolean;
  isAuthenticated: (data: T) => boolean;
}

export default function createCurrentUserPrimitive<T>(config: Config<T>) {
  createRoot(() => {
    const [authenticationStatus, setAuthenticationStatus] = createSignal(AuthenticationStatus.Pending);
    const [authenticationError, setAuthenticationError] = createSignal<Error | null>(null);

    const [currentUser, { refetch }] = config.createCurrentUserResource();

    createEffect(() => {
      try {
        if (currentUser.state === 'errored') {
          if (config.isUnauthenticatedError(currentUser.error)) {
            setAuthenticationStatus(AuthenticationStatus.Unauthenticated);
          } else {
            setAuthenticationStatus(AuthenticationStatus.Errored);
            setAuthenticationError(currentUser.error);
          }
        } else if (currentUser.state === 'ready') {
          if (config.isAuthenticated(currentUser())) {
            setAuthenticationStatus(AuthenticationStatus.Authenticated);
          } else {
            setAuthenticationStatus(AuthenticationStatus.Unauthenticated);
          }
        }
      } catch (e: any) {
        setAuthenticationStatus(AuthenticationStatus.Errored);
        setAuthenticationError(e);
      }
    });

    setPrimitive<T>([currentUser, { authenticationStatus, authenticationError, refetch }]);
  });
}
