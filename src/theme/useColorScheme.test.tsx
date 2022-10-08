import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import ColorSchemeStylesheet from './ColorSchemeStylesheet';
import { ColorSchemeProvider, ColorSchemeStorage } from './useColorScheme';

describe("useColorScheme", () => {
  afterEach(cleanup);

  test("pick right stylesheet", () => {
    render(() =>
      <ColorSchemeProvider storage={ColorSchemeStorage.signalStorage} defaultScheme="dark">
        <ColorSchemeStylesheet
          dark="https://example.com"
          light="https://example.com"
        />
      </ColorSchemeProvider>
    );

    const dark = screen.queryByTestId("stylesheet-dark");
    expect(dark).toBeInstanceOf(HTMLElement);

    const light = screen.queryByTestId("stylesheet-light");
    expect(light).toBeNull();
  });
});
