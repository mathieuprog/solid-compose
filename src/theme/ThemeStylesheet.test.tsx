import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  createThemePrimitive,
  ThemeStylesheet,
  useTheme
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

  const [theme, setTheme] = useTheme();

  expect(theme()).toBe('darkTheme');

  let meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('dark light');
  expect(document.documentElement.style.colorScheme).toBe('dark light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('darkTheme');

  setTheme('fooTheme');

  meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('only light');
  expect(document.documentElement.style.colorScheme).toBe('only light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('fooTheme');
});
