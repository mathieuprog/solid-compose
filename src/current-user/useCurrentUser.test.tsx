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
    getCurrentUserResource: () => userResourceReturn,
    isUnauthenticatedError: () => false,
    isAuthenticated: () => true
  });

  const [currentUser, { authenticationStatus }] = useCurrentUser<User>();

  expect(currentUser.loading).toBe(false);
  expect(currentUser()?.name).toBe('John');
  expect(authenticationStatus()).toBe(AuthenticationStatus.Authenticated);
});
