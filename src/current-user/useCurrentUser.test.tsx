import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  AuthenticationStatus,
  createCurrentUserPrimitive,
  useCurrentUser
} from '..';
import { createResource } from 'solid-js';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useCurrentUser()
  ).toThrow(/createCurrentUserPrimitive/);
});

type User = { name: string };
const userResourceReturn = createResource<User>(() => ({ name: 'John' }));

test('use current user primitive', () => {
  createCurrentUserPrimitive({
    createCurrentUserResource: () => userResourceReturn,
    isUnauthenticatedError: () => false,
    isAuthenticated: () => true,
    meta: { foo: 1 }
  });

  const [currentUser, { authenticationStatus, meta }] = useCurrentUser<User, { foo: number }>();

  expect(currentUser.loading).toBe(false);
  expect(currentUser()?.name).toBe('John');
  expect(authenticationStatus()).toBe(AuthenticationStatus.Authenticated);
  expect(meta.foo).toBe(1);
});
