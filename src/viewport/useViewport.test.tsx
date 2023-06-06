import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  createViewportPrimitive,
  useViewport
} from '..';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useViewport()
  ).toThrow(/createViewportPrimitive/);
});
