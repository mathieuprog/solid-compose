import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from 'solid-testing-library';
import use18n, {
  addTranslations,
  enableNestedTranslations,
  I18nProvider,
  removeAllTranslations
} from '@/i18n/useI18n';
import enTranslations from './support/en.json';
import frTranslations from './support/fr.json';

describe('useI18n', () => {
  beforeEach(() => {
    removeAllTranslations();
    enableNestedTranslations(false);

    addTranslations('en', 'foo', {
      "hello": "hello",
      "foo": "bar"
    });

    addTranslations('fr', 'foo', {
      "hello": "bonjour",
    });

    addTranslations('en', 'bar', {
      "hello": "hello!",
      "world": "world!"
    });

    addTranslations('fr', 'bar', {
      "hello": "bonjour !",
      "world": "monde !"
    });

    addTranslations('fr-BE', 'bar', {
      "world": "monde !!"
    });
  });

  afterEach(cleanup);

  test('translate', async () => {
    function Hello() {
      const [translate, locale] = use18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <div data-testid="world">{translate('world')}</div>
        <div data-testid="foo">{translate('foo')}</div>
        <button data-testid="locale" onClick={() => locale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider locale="en" namespaces={['foo', 'bar']}>
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

  test('key separator', async () => {
    removeAllTranslations();
    enableNestedTranslations('.');

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
      const [translate, locale] = use18n();
      return <>
        <div data-testid="hello">{translate('welcome.hello')}</div>
        <div data-testid="world">{translate('world')}</div>
        <button data-testid="locale" onClick={() => locale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider locale="en" namespaces={['foo']}>
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
    removeAllTranslations();

    addTranslations('en', {
      "hello": "hello!",
      "world": "world!"
    });

    addTranslations('fr', {
      "hello": "bonjour !",
      "world": "monde !"
    });

    function Hello() {
      const [translate, locale] = use18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <button data-testid="locale" onClick={() => locale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider locale="en">
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
    removeAllTranslations();

    addTranslations('en', enTranslations);
    addTranslations('fr', frTranslations);

    function Hello() {
      const [translate, locale] = use18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <button data-testid="locale" onClick={() => locale('fr-BE')}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider locale="en">
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
