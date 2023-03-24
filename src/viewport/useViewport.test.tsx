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
        max: 768
      },
      medium: {
        min: 768,
        max: 1280
      },
      large: {
        min: 1280
      },
    }
  });

  const viewport = useViewport();

  expect(viewport.height).toBe(undefined);
  expect(viewport.width).toBe(undefined);
  expect(viewport.orientation).toBe(undefined);
});
