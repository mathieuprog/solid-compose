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

test('set language tag', () => {
  createViewportPrimitive({
    widthSizeSwitchpoints: {
      small: {
        maxWidth: 768
      },
      medium: {
        minWidth: 768,
        maxWidth: 1280
      },
      large: {
        minWidth: 1280
      },
    }
  });

  const viewport = useViewport();

  expect(viewport.height).toBe(undefined);
  expect(viewport.width).toBe(undefined);
  expect(viewport.orientation).toBe(undefined);
});
