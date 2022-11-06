import { createSignal } from 'solid-js';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorScheme,
  ColorSchemeStorage,
  ColorSchemeStylesheet,
  createColorSchemePrimitive,
  useColorScheme
} from '@/index';

describe('useColorScheme', () => {
  afterEach(cleanup);

  test('missing global state should throw error', () => {
    expect(
      () => useColorScheme()
    ).toThrow(/createColorSchemePrimitive/);
  });

  test('default to dark', () => {
    createColorSchemePrimitive({
      default: ColorScheme.Dark,
      storage: ColorSchemeStorage.signalStorage
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-LIGHT')).toBeNull();
    expect(screen.queryByTestId('stylesheet-DARK')).toBeInstanceOf(HTMLElement);
  });

  test('default to light', () => {
    createColorSchemePrimitive({
      default: ColorScheme.Light,
      storage: ColorSchemeStorage.signalStorage
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-DARK')).toBeNull();
    expect(screen.queryByTestId('stylesheet-LIGHT')).toBeInstanceOf(HTMLElement);
  });

  test('pick right stylesheet', () => {
    const signal = createSignal<ColorScheme>(ColorScheme.Dark);

    createColorSchemePrimitive({
      storage: signal
    });

    render(() =>
      <ColorSchemeStylesheet
        dark="https://example.com"
        light="https://example.com"
      />
    );

    expect(screen.queryByTestId('stylesheet-LIGHT')).toBeNull();
    expect(screen.queryByTestId('stylesheet-DARK')).toBeInstanceOf(HTMLElement);

    const [colorScheme, setColorScheme] = signal;

    expect(colorScheme()).toBe(ColorScheme.Dark);

    setColorScheme(ColorScheme.Light);

    expect(screen.queryByTestId('stylesheet-DARK')).toBeNull();
    expect(screen.queryByTestId('stylesheet-LIGHT')).toBeInstanceOf(HTMLElement);

    expect(colorScheme()).toBe(ColorScheme.Light);
  });
});
