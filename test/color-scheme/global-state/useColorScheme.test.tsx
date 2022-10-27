import { createSignal } from 'solid-js';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorSchemeStorage,
  ColorSchemeStylesheet,
  createColorSchemePrimitive,
  useGlobalColorScheme
} from '@/index';
import type { ColorScheme } from '@/color-scheme/useColorScheme';

describe('useColorScheme', () => {
  afterEach(cleanup);

  test('missing global state should throw error', () => {
    expect(
      () => useGlobalColorScheme()
    ).toThrow(/createColorSchemePrimitive/);
  });

  test('default to dark', () => {
    createColorSchemePrimitive({
      default: 'dark',
      storage: ColorSchemeStorage.signalStorage
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-light')).toBeNull();
    expect(screen.queryByTestId('stylesheet-dark')).toBeInstanceOf(HTMLElement);
  });

  test('default to light', () => {
    createColorSchemePrimitive({
      default: 'light',
      storage: ColorSchemeStorage.signalStorage
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-dark')).toBeNull();
    expect(screen.queryByTestId('stylesheet-light')).toBeInstanceOf(HTMLElement);
  });

  test('pick right stylesheet', () => {
    const signal = createSignal<ColorScheme>('dark');

    createColorSchemePrimitive({
      storage: signal
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-light')).toBeNull();
    expect(screen.queryByTestId('stylesheet-dark')).toBeInstanceOf(HTMLElement);

    const [colorScheme, setColorScheme] = signal;

    expect(colorScheme()).toBe('dark');

    setColorScheme('light');

    expect(screen.queryByTestId('stylesheet-dark')).toBeNull();
    expect(screen.queryByTestId('stylesheet-light')).toBeInstanceOf(HTMLElement);

    expect(colorScheme()).toBe('light');
  });
});
