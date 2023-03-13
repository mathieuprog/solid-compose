import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorScheme,
  ColorSchemeStylesheet,
  createLocalePrimitive
} from '..';

afterEach(cleanup);

test('default to dark', () => {
  createLocalePrimitive({
    initialValues: {
      colorScheme: ColorScheme.Dark
    },
    supportedLanguageTags: ['en']
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
  createLocalePrimitive({
    initialValues: {
      colorScheme: ColorScheme.Light
    },
    supportedLanguageTags: ['en']
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
