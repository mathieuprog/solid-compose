import { createSignal } from 'solid-js';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet
} from '@/index';
import type { ColorScheme } from '@/color-scheme/useColorScheme';

describe('useColorScheme', () => {
  afterEach(cleanup);

  test('default to dark', () => {
    render(() =>
      <ColorSchemeProvider storage={ColorSchemeStorage.signalStorage} defaultScheme="dark">
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    expect(screen.queryByTestId('stylesheet-light')).toBeNull();
    expect(screen.queryByTestId('stylesheet-dark')).toBeInstanceOf(HTMLElement);
  });

  test('default to light', () => {
    render(() =>
      <ColorSchemeProvider storage={ColorSchemeStorage.signalStorage} defaultScheme="light">
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    expect(screen.queryByTestId('stylesheet-dark')).toBeNull();
    expect(screen.queryByTestId('stylesheet-light')).toBeInstanceOf(HTMLElement);
  });

  test('pick right stylesheet', () => {
    const signal = createSignal<ColorScheme>('dark');

    render(() =>
      <ColorSchemeProvider storage={signal}>
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
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
