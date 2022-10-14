import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import ColorSchemeStylesheet from './ColorSchemeStylesheet';
import { ColorSchemeProvider, ColorSchemeStorage } from './useColorScheme';
import type { ColorScheme } from './useColorScheme';
import { createSignal } from 'solid-js';

describe("useColorScheme", () => {
  afterEach(cleanup);

  test("default to dark", () => {
    render(() =>
      <ColorSchemeProvider storage={ColorSchemeStorage.signalStorage} defaultScheme="dark">
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    expect(screen.queryByTestId("stylesheet-light")).toBeNull();
    expect(screen.queryByTestId("stylesheet-dark")).toBeInstanceOf(HTMLElement);
  });

  test("default to light", () => {
    render(() =>
      <ColorSchemeProvider storage={ColorSchemeStorage.signalStorage} defaultScheme="light">
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    expect(screen.queryByTestId("stylesheet-dark")).toBeNull();
    expect(screen.queryByTestId("stylesheet-light")).toBeInstanceOf(HTMLElement);
  });

  test("pick right stylesheet", () => {
    const signal = createSignal<ColorScheme>("dark");

    const storageStrategy: ColorSchemeStorage = () => signal;

    render(() =>
      <ColorSchemeProvider storage={storageStrategy}>
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    expect(screen.queryByTestId("stylesheet-light")).toBeNull();
    expect(screen.queryByTestId("stylesheet-dark")).toBeInstanceOf(HTMLElement);

    const [colorScheme, setColorScheme] = signal;

    expect(colorScheme()).toBe('dark');

    setColorScheme('light');

    expect(screen.queryByTestId("stylesheet-dark")).toBeNull();
    expect(screen.queryByTestId("stylesheet-light")).toBeInstanceOf(HTMLElement);

    expect(colorScheme()).toBe('light');
  });
});
