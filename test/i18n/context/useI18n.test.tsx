import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from 'solid-testing-library';
import { removeAllTranslations } from '@/i18n/useI18n';
import {
  addTranslations,
  I18nProvider,
  createLocalePrimitive,
  setupI18n,
  useContext18n,
  useLocale
} from '@/index';
import enTranslations from '../support/en.json';
import frTranslations from '../support/fr.json';
import addDefaultTranslations from '../support/addDefaultTranslations';

describe('useContext18n', () => {
  beforeEach(() => {
    removeAllTranslations();
  });

  afterEach(cleanup);

  test('translate', async () => {
    addDefaultTranslations();
    createLocalePrimitive({ default: 'en' });
    setupI18n({
      fallbackLocales: ['en'],
      keySeparator: ''
    });

    function Hello() {
      const [locale, setLocale] = useLocale();
      const translate = useContext18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <div data-testid="world">{translate('world')}</div>
        <div data-testid="foo">{translate('foo')}</div>
        <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider namespaces={['foo', 'bar']}>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId('hello');
    const world = screen.getByTestId('world');
    const foo = screen.getByTestId('foo');
    const locale = screen.getByTestId('locale');

    expect(hello.textContent).toBe('hello!');
    expect(world.textContent).toBe('world!');
    expect(foo.textContent).toBe('bar');
    expect(locale.textContent).toBe('en');

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(locale.textContent).toBe('fr-BE');
    expect(hello.textContent).toBe('bonjour !');
    expect(world.textContent).toBe('monde !!');
    expect(foo.textContent).toBe('bar');
  });

  test('translate with parameter', async () => {
    createLocalePrimitive({ default: 'en' });
    setupI18n({
      fallbackLocales: ['en'],
      keySeparator: ''
    });

    addTranslations('en', {
      "hello": "hello {{ name }}",
      "welcome": "welcome {{ name }}"
    });

    addTranslations('fr', {
      "hello": "bonjour {{ name }}"
    });

    function Hello() {
      const [_locale, setLocale] = useLocale();
      const translate = useContext18n();
      return <>
        <div data-testid="hello">{translate('hello', { name: 'John' })}</div>
        <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
        </button>
      </>;
    }

    render(() =>
      <I18nProvider>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId('hello');
    const locale = screen.getByTestId('locale');

    expect(hello.textContent).toBe('hello John');

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(hello.textContent).toBe('bonjour John');
  });

  test('key separator', async () => {
    createLocalePrimitive({ default: 'en' });
    setupI18n({
      fallbackLocales: [],
      keySeparator: '.'
    });

    addTranslations('en', 'foo', {
      "welcome": {
        "hello": "hello!"
      },
      "world": "world!"
    });

    addTranslations('fr', 'foo', {
      "welcome": {
        "hello": "bonjour !"
      },
      "world": "monde !"
    });

    function Hello() {
      const [locale, setLocale] = useLocale();
      const translate = useContext18n();
      return <>
        <div data-testid="hello">{translate('welcome.hello')}</div>
        <div data-testid="world">{translate('world')}</div>
        <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider namespaces={['foo']}>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId('hello');
    const world = screen.getByTestId('world');
    const locale = screen.getByTestId('locale');

    expect(hello.textContent).toBe('hello!');
    expect(world.textContent).toBe('world!');

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(locale.textContent).toBe('fr-BE');
    expect(hello.textContent).toBe('bonjour !');
    expect(world.textContent).toBe('monde !');
  });

  test('default namespace', async () => {
    createLocalePrimitive({ default: 'en' });
    setupI18n({
      fallbackLocales: [],
      keySeparator: ''
    });

    addTranslations('en', {
      "hello": "hello!",
      "world": "world!"
    });

    addTranslations('fr', {
      "hello": "bonjour !",
      "world": "monde !"
    });

    function Hello() {
      const [locale, setLocale] = useLocale();
      const translate = useContext18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId('hello');
    const locale = screen.getByTestId('locale');

    expect(hello.textContent).toBe('hello!');

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(locale.textContent).toBe('fr-BE');
    expect(hello.textContent).toBe('bonjour !');
  });

  test('add translations from json files', async () => {
    createLocalePrimitive({ default: 'en' });
    setupI18n({
      fallbackLocales: [],
      keySeparator: ''
    });

    addTranslations('en', enTranslations);
    addTranslations('fr', frTranslations);

    function Hello() {
      const [locale, setLocale] = useLocale();
      const translate = useContext18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId('hello');
    const locale = screen.getByTestId('locale');

    expect(hello.textContent).toBe('hello!');

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(locale.textContent).toBe('fr-BE');
    expect(hello.textContent).toBe('bonjour !');
  });
});
