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
    themes: [
      {
        name: 'fooTheme',
        path: 'https://example.com',
        colorScheme: ColorScheme.Light
      },
      {
        name: 'lightTheme',
        path: 'https://example.com',
        colorScheme: ColorScheme.Light,
        default: true
      },
      {
        name: 'darkTheme',
        path: 'https://example.com',
        colorScheme: ColorScheme.Dark,
        default: true
      }
    ]
  });

  render(() =>
    <ThemeStylesheet />
  );

  expect(screen.queryByTestId('stylesheet-fooTheme')).toBeNull();
  expect(screen.queryByTestId('stylesheet-lightTheme')).toBeNull();
  expect(screen.queryByTestId('stylesheet-darkTheme')).toBeInstanceOf(HTMLElement);
});
