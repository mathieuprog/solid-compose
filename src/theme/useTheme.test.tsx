import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import {
  ColorScheme,
  createLocalePrimitive,
  createThemePrimitive,
  useLocale,
  useTheme
} from '..';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useTheme()
  ).toThrow(/createThemePrimitive/);
});

test('initial theme', () => {
  createLocalePrimitive({ supportedLanguageTags: ['en'] });

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
        colorScheme: ColorScheme.Light
      },
      {
        name: 'darkTheme',
        path: 'https://example.com',
        colorScheme: ColorScheme.Dark
      }
    ],
    initialTheme: 'darkTheme'
  });

  const [theme, setTheme] = useTheme();
  const [locale] = useLocale();

  expect(theme()).toBe('darkTheme');
  expect(locale.colorScheme).toBe(ColorScheme.Dark);

  setTheme('fooTheme');

  expect(theme()).toBe('fooTheme');
  expect(locale.colorScheme).toBe(ColorScheme.Light);

  setTheme('lightTheme');

  expect(theme()).toBe('lightTheme');
  expect(locale.colorScheme).toBe(ColorScheme.Light);
});

test('default theme', () => {
  createLocalePrimitive({ supportedLanguageTags: ['en'] });

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

  const [locale] = useLocale();
  const [theme, setTheme] = useTheme();

  if (locale.colorScheme === ColorScheme.Light) {
    expect(theme()).toBe('lightTheme');
    setTheme('fooTheme');
    expect(theme()).toBe('fooTheme');
  } else {
    expect(theme()).toBe('darkTheme');
    setTheme('fooTheme');
    expect(theme()).toBe('fooTheme');
  }
});

test('no themes provided throws error', () => {
  expect(() =>
    createThemePrimitive({
      themes: []
    })
  ).toThrow(/no stylesheets/);
});
