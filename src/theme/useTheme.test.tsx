import { afterEach, expect, test } from 'vitest';
import { cleanup } from 'solid-testing-library';
import { ColorScheme, createLocalePrimitive, createThemePrimitive, useLocale, useTheme } from '..';

afterEach(cleanup);

test('missing global state should throw error', () => {
  expect(
    () => useTheme()
  ).toThrow(/createThemePrimitive/);
});

test('initial theme', () => {
  createThemePrimitive({
    themes: {
      'fooTheme': 'https://example.com',
      'lightTheme': 'https://example.com',
      'darkTheme': 'https://example.com'
    },
    initialTheme: 'fooTheme'
  });

  const [theme, setTheme] = useTheme();

  expect(theme()).toBe('fooTheme');

  setTheme('lightTheme');

  expect(theme()).toBe('lightTheme');
});

test('default theme', () => {
  createLocalePrimitive({ supportedLanguageTags: ['en'] });

  createThemePrimitive({
    themes: {
      'fooTheme': 'https://example.com',
      'lightTheme': 'https://example.com',
      'darkTheme': 'https://example.com'
    },
    defaultDarkTheme: 'darkTheme',
    defaultLightTheme: 'lightTheme'
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
      themes: {},
      defaultDarkTheme: 'lightTheme',
      defaultLightTheme: 'darkTheme'
    })
  ).toThrow(/no stylesheets/);
});
