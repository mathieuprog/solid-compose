import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
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
const [userResource] = createResource<User>(() => ({ name: 'John' }));

test('use current user primitive', () => {
  createCurrentUserPrimitive({
    getCurrentUserResource: () => userResource,
    isUnauthenticatedError: () => false,
    isAuthenticated: () => true
  });

  const [currentUser, { authenticated, isUnauthenticatedError }] = useCurrentUser<User>();

  expect(currentUser.loading).toBe(false);
  expect(currentUser()?.name).toBe('John');
  expect(authenticated()).toBe(true);
  expect(isUnauthenticatedError()).toBe(false);
});
