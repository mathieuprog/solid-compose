import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from 'solid-testing-library';
import {
  ColorScheme,
  ColorSchemeStylesheet,
  createLocalePrimitive,
  useLocale
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

  const meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('dark light');
  expect(document.documentElement.style.colorScheme).toBe('dark light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark');
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

  const meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('only light');
  expect(document.documentElement.style.colorScheme).toBe('only light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('light');
});

test('switch color scheme', () => {
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

  let meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('only light');
  expect(document.documentElement.style.colorScheme).toBe('only light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('light');

  const [locale, { setColorScheme }] = useLocale();

  setColorScheme(ColorScheme.Dark);

  meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;

  expect(meta.content).toBe('dark light');
  expect(document.documentElement.style.colorScheme).toBe('dark light');
  expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark');
});
