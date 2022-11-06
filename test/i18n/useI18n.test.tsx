import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from 'solid-testing-library';
import {
  addTranslations,
  createI18nPrimitive,
  createLocalePrimitive,
  I18nProvider,
  useI18n,
  useLocale
} from '@/index';
import enTranslations from './support/en.json';
import frTranslations from './support/fr.json';
import { removeAllTranslations } from '@/i18n/createI18nPrimitive';
import { setPrimitive } from '@/i18n/globalPrimitive';

beforeEach(() => {
  removeAllTranslations();
  setPrimitive(null!);
});

afterEach(cleanup);

test('translate', async () => {
  addTranslations('en', {
    "foo": "bar"
  });

  addTranslations('en', {
    "hello": "hello!",
    "world": "world!"
  });

  addTranslations('fr', {
    "hello": "bonjour !",
    "world": "monde !"
  });

  addTranslations('fr-BE', {
    "world": "monde !!"
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: ['en'],
    keySeparator: ''
  });

  function Hello() {
    const [locale, setLocale] = useLocale();
    const translate = useI18n();
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
    <Hello/>
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

test('translate with parameter', () => {
  addTranslations('en', {
    "hello": "hello"
  });

  expect(() => {
    addTranslations('en', {
      "hello": "hello!"
    });
  }).toThrow(/colliding/);
});

test('translate with parameter', () => {
  addTranslations('en', {
    "hello": "hello {{ name }}",
    "welcome": "welcome {{ name }}"
  });

  addTranslations('fr', {
    "hello": "bonjour {{ name }}"
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: ['en'],
    keySeparator: ''
  });

  const [_locale, setLocale] = useLocale();
  const translate = useI18n();

  expect(translate('hello', { name: 'John' })).toBe('hello John');
  expect(() => translate('welcome', { age: 25 })).toThrow(/name/);
  expect(() => translate('welcome', { name: 'John', age: 25 })).toThrow(/too many parameters/);

  setLocale('fr');

  expect(translate('hello', { name: 'John' })).toBe('bonjour John');
});

test('translate with parameter being object', () => {
  addTranslations('en', {
    "hello": "hello {{ user.firstName }}, {{ user.firstName }} {{ user.lastName }}",
    "welcome": "welcome {{ user.name }}"
  });

  addTranslations('fr', {
    "welcome": "bienvenue {{ user.name }}"
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: ['en'],
    keySeparator: ''
  });

  const [_locale, setLocale] = useLocale();
  const translate = useI18n();

  expect(translate('hello', { user: { firstName: 'John', lastName: 'Doe' }})).toBe('hello John, John Doe');
  expect(() => translate('hello', { user: { firstName: 'John' }})).toThrow(/lastName/);
  expect(() => translate('welcome', { user: { name: 'John', age: 25 }})).toThrow(/too many parameters/);

  setLocale('fr');

  expect(translate('welcome', { user: { name: 'John' }})).toBe('bienvenue John');
});

test('translate plural forms', () => {
  addTranslations('en', {
    "messages": {
      "one": "One message received, {{ name }}.",
      "other": "{{ count }} messages received, {{ name }}.",
      "zero": "No messages received, {{ name }}."
    }
  });

  addTranslations('fr', {
    "messages": {
      "one": "Un message reçu, {{ name }}.",
      "other": "{{ count }} messages reçus, {{ name }}.",
      "zero": "Aucun message reçu, {{ name }}."
    }
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: ['en'],
    keySeparator: ''
  });

  const [_locale, setLocale] = useLocale();
  const translate = useI18n();

  expect(translate('messages', { count: 1, name: 'John' })).toBe('One message received, John.');

  setLocale('fr');

  expect(translate('messages', { count: 1, name: 'John' })).toBe('Un message reçu, John.');
});

test('key separator', async () => {
  addTranslations('en', {
    "welcome": {
      "hello": "hello!",
      "messages": {
        "one": "One message received, {{ name }}.",
        "other": "{{ count }} messages received, {{ name }}.",
        "zero": "No messages received, {{ name }}."
      }
    },
    "world": "world!"
  });

  addTranslations('fr', {
    "welcome": {
      "hello": "bonjour !",
      "messages": {
        "one": "Un message reçu, {{ name }}.",
        "other": "{{ count }} messages reçus, {{ name }}.",
        "zero": "Aucun message reçu, {{ name }}."
      }
    },
    "world": "monde !"
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: [],
    keySeparator: '.'
  });

  function Hello() {
    const [locale, setLocale] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="hello">{translate('welcome.hello')}</div>
      <div data-testid="messages">{translate('welcome.messages', { count: 1, name: 'John' })}</div>
      <div data-testid="world">{translate('world')}</div>
      <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
        {locale()}
      </button>
    </>;
  }

  render(() =>
    <Hello/>
  );

  const hello = screen.getByTestId('hello');
  const world = screen.getByTestId('world');
  const messages = screen.getByTestId('messages');
  const locale = screen.getByTestId('locale');

  expect(hello.textContent).toBe('hello!');
  expect(world.textContent).toBe('world!');
  expect(messages.textContent).toBe('One message received, John.');

  fireEvent.click(locale);
  // the event loop takes one Promise to resolve to be finished
  await Promise.resolve();

  expect(locale.textContent).toBe('fr-BE');
  expect(hello.textContent).toBe('bonjour !');
  expect(world.textContent).toBe('monde !');
  expect(messages.textContent).toBe('Un message reçu, John.');
});

test('namespaced translations', async () => {
  addTranslations('en', 'foo', { "hello": "hello!" });
  addTranslations('fr', 'foo', { "hello": "bonjour !" });

  addTranslations('en', 'bar', { "world": "world!" });
  addTranslations('fr', 'bar', { "world": "monde !" });

  addTranslations('en', 'baz', {
    "hello": "hello.",
    "world": "world."
  });
  addTranslations('fr', 'baz', {
    "hello": "bonjour.",
    "world": "monde."
  });

  addTranslations('en', {
    "global": "something",
    "hello": "hello...",
    "world": "world..."
  });
  addTranslations('fr', {
    "global": "quelque chose",
    "hello": "bonjour...",
    "world": "monde..."
  });

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: [],
    keySeparator: ''
  });

  function Namespaced1() {
    const [locale, setLocale] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="global1">{translate('global')}</div>
      <div data-testid="hello1">{translate('hello')}</div>
      <div data-testid="world1">{translate('world')}</div>
      <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
        {locale()}
      </button>
    </>;
  }

  function Namespaced2() {
    const translate = useI18n();
    return <>
      <div data-testid="global2">{translate('global')}</div>
      <div data-testid="hello2">{translate('hello')}</div>
      <div data-testid="world2">{translate('world')}</div>
    </>;
  }

  function Global() {
    const translate = useI18n();
    return <>
      <div data-testid="global">{translate('global')}</div>
      <div data-testid="hello">{translate('hello')}</div>
      <div data-testid="world">{translate('world')}</div>
    </>;
  }

  render(() =>
    <>
      <I18nProvider namespaces={['foo', 'bar']}>
        <Namespaced1/>
      </I18nProvider>

      <Global/>

      <I18nProvider namespaces={['baz']}>
        <Namespaced2/>
      </I18nProvider>
    </>
  );

  const globalNs1 = screen.getByTestId('global1');
  const helloNs1 = screen.getByTestId('hello1');
  const worldNs1 = screen.getByTestId('world1');
  const globalNs2 = screen.getByTestId('global2');
  const helloNs2 = screen.getByTestId('hello2');
  const worldNs2 = screen.getByTestId('world2');
  const global = screen.getByTestId('global');
  const hello = screen.getByTestId('hello');
  const world = screen.getByTestId('world');
  const locale = screen.getByTestId('locale');

  expect(globalNs1.textContent).toBe('something');
  expect(helloNs1.textContent).toBe('hello!');
  expect(worldNs1.textContent).toBe('world!');
  expect(globalNs2.textContent).toBe('something');
  expect(helloNs2.textContent).toBe('hello.');
  expect(worldNs2.textContent).toBe('world.');
  expect(global.textContent).toBe('something');
  expect(hello.textContent).toBe('hello...');
  expect(world.textContent).toBe('world...');

  fireEvent.click(locale);
  // the event loop takes one Promise to resolve to be finished
  await Promise.resolve();

  expect(locale.textContent).toBe('fr-BE');
  expect(globalNs1.textContent).toBe('quelque chose');
  expect(helloNs1.textContent).toBe('bonjour !');
  expect(worldNs1.textContent).toBe('monde !');
  expect(globalNs2.textContent).toBe('quelque chose');
  expect(helloNs2.textContent).toBe('bonjour.');
  expect(worldNs2.textContent).toBe('monde.');
  expect(global.textContent).toBe('quelque chose');
  expect(hello.textContent).toBe('bonjour...');
  expect(world.textContent).toBe('monde...');
});

test('add translations from json files', async () => {
  addTranslations('en', enTranslations);
  addTranslations('fr', frTranslations);

  createLocalePrimitive({ default: 'en' });
  createI18nPrimitive({
    fallbackLocales: [],
    keySeparator: ''
  });

  function Hello() {
    const [locale, setLocale] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="hello">{translate('hello')}</div>
      <button data-testid="locale" onClick={() => setLocale('fr-BE')}>
        {locale()}
      </button>
    </>;
  }

  render(() =>
    <Hello/>
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
