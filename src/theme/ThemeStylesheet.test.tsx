import { cleanup, render } from 'solid-testing-library';
import { afterEach, expect, test } from 'vitest';
import {
    ColorScheme,
    ThemeStylesheet,
    createLocalePrimitive,
    createThemeEffect,
    createThemePrimitive,
    useLocale,
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
        colorScheme: ColorScheme.Light
      },
      {
        name: 'lightTheme',
        colorScheme: ColorScheme.Light,
        default: true
      },
      {
        name: 'darkTheme',
        colorScheme: ColorScheme.Dark,
        default: true
      }
    ]
  });

  createThemeEffect();

  render(() =>
    <ThemeStylesheet />
  );

  const [theme, setTheme] = useTheme();
  const [locale] = useLocale();

  expect(theme()).toBe('darkTheme');
  expect(locale.colorScheme).toBe(ColorScheme.Dark);

  let meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('dark');
  expect(document.documentElement.style.colorScheme).toBe('dark');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('darkTheme');

  setTheme('fooTheme');

  expect(theme()).toBe('fooTheme');
  expect(locale.colorScheme).toBe(ColorScheme.Light);

  meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('light');
  expect(document.documentElement.style.colorScheme).toBe('light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('fooTheme');
});
