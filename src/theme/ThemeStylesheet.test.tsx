import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  createThemePrimitive,
  ThemeStylesheet
} from '..';

afterEach(cleanup);

test('pick the right theme', () => {
  createLocalePrimitive({
    initialValues: {
      colorScheme: ColorScheme.Dark
    },
    supportedLanguageTags: ['en']
  });

  createThemePrimitive({
    themes: {
      'fooTheme': 'https://example.com',
      'lightTheme': 'https://example.com',
      'darkTheme': 'https://example.com'
    },
    defaultDarkTheme: 'darkTheme',
    defaultLightTheme: 'lightTheme'
  });

  render(() =>
    <ThemeStylesheet />
  );

  expect(screen.queryByTestId('stylesheet-fooTheme')).toBeNull();
  expect(screen.queryByTestId('stylesheet-lightTheme')).toBeNull();
  expect(screen.queryByTestId('stylesheet-darkTheme')).toBeInstanceOf(HTMLElement);
});
