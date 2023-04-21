import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from 'solid-testing-library';
import {
  addTranslations,
  createI18nPrimitive,
  createLocalePrimitive,
  getSupportedLanguageTags,
  I18nProvider,
  useI18n,
  useLocale
} from '..';
import { removeAllTranslations } from './createI18nPrimitive';
import { setPrimitive } from './globalPrimitive';

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

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    fallbackLanguageTag: 'en',
    keySeparator: ''
  });

  function Hello() {
    const [locale, { setLanguageTag }] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="hello">{translate('hello')}</div>
      <div data-testid="hello-fr">{translate('hello', {}, 'fr')}</div>
      <div data-testid="hello-en">{translate('hello', {}, 'en')}</div>
      <div data-testid="world">{translate('world')}</div>
      <div data-testid="world-fr">{translate('world', {}, 'fr')}</div>
      <div data-testid="world-en">{translate('world', {}, 'en')}</div>
      <div data-testid="foo">{translate('foo')}</div>
      <div data-testid="foo-fr">{translate('foo', {}, 'fr')}</div>
      <div data-testid="foo-en">{translate('foo', {}, 'en')}</div>
      <button data-testid="locale" onClick={() => setLanguageTag('fr-BE')}>
        {locale.languageTag}
      </button>
    </>;
  }

  render(() =>
    <Hello/>
  );

  expect(screen.getByTestId('hello').textContent).toBe('hello!');
  expect(screen.getByTestId('world').textContent).toBe('world!');
  expect(screen.getByTestId('foo').textContent).toBe('bar');
  expect(screen.getByTestId('locale').textContent).toBe('en');

  expect(screen.getByTestId('hello-fr').textContent).toBe('bonjour !');
  expect(screen.getByTestId('hello-en').textContent).toBe('hello!');
  expect(screen.getByTestId('world-fr').textContent).toBe('monde !');
  expect(screen.getByTestId('world-en').textContent).toBe('world!');
  expect(screen.getByTestId('foo-fr').textContent).toBe('bar');
  expect(screen.getByTestId('foo-en').textContent).toBe('bar');

  fireEvent.click(screen.getByTestId('locale'));
  // the event loop takes one Promise to resolve to be finished
  await Promise.resolve();

  expect(screen.getByTestId('locale').textContent).toBe('fr-BE');
  expect(screen.getByTestId('hello').textContent).toBe('bonjour !');
  expect(screen.getByTestId('world').textContent).toBe('monde !!');
  expect(screen.getByTestId('foo').textContent).toBe('bar');

  expect(screen.getByTestId('hello-fr').textContent).toBe('bonjour !');
  expect(screen.getByTestId('hello-en').textContent).toBe('hello!');
  expect(screen.getByTestId('world-fr').textContent).toBe('monde !');
  expect(screen.getByTestId('world-en').textContent).toBe('world!');
  expect(screen.getByTestId('foo-fr').textContent).toBe('bar');
  expect(screen.getByTestId('foo-en').textContent).toBe('bar');
});

test('fallback locale not supported should throw an error', () => {
  addTranslations('en', { "foo": "bar" });
  createLocalePrimitive({ supportedLanguageTags: getSupportedLanguageTags() });
  expect(() => createI18nPrimitive({ fallbackLanguageTag: 'fr' })).toThrow(/no translations found for language fr/);
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

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    fallbackLanguageTag: 'en',
    keySeparator: ''
  });

  const [_locale, { setLanguageTag }] = useLocale();
  const translate = useI18n();

  expect(translate('hello', { name: 'John' })).toBe('hello John');
  expect(translate('hello', { name: 'John' }, 'fr')).toBe('bonjour John');
  expect(() => translate('welcome', { age: 25 })).toThrow(/name/);
  expect(() => translate('welcome', { name: 'John', age: 25 })).toThrow(/too many parameters/);

  setLanguageTag('fr');

  expect(translate('hello', { name: 'John' })).toBe('bonjour John');
  expect(translate('hello', { name: 'John' }, 'en')).toBe('hello John');
});

test('translate with parameter being object', () => {
  addTranslations('en', {
    "hello": "hello {{ user.firstName }}, {{ user.firstName }} {{ user.lastName }}",
    "welcome": "welcome {{ user.name }}"
  });

  addTranslations('fr', {
    "welcome": "bienvenue {{ user.name }}"
  });

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    fallbackLanguageTag: 'en',
    keySeparator: ''
  });

  const [_locale, { setLanguageTag }] = useLocale();
  const translate = useI18n();

  expect(translate('hello', { user: { firstName: 'John', lastName: 'Doe' }})).toBe('hello John, John Doe');
  expect(() => translate('hello', { user: { firstName: 'John' }})).toThrow(/lastName/);
  expect(() => translate('welcome', { user: { name: 'John', age: 25 }})).toThrow(/too many parameters/);

  setLanguageTag('fr');

  expect(translate('welcome', { user: { name: 'John' }})).toBe('bienvenue John');
});

test('translate plural forms', () => {
  addTranslations('en', {
    "messages": {
      "one": "One message received, {{ name }}.",
      "other": "{{ cardinal }} messages received, {{ name }}.",
      "zero": "No messages received, {{ name }}."
    },
    "position": {
      "one": "{{ ordinal }}st",
      "two": "{{ ordinal }}nd",
      "few": "{{ ordinal }}rd",
      "other": "{{ ordinal }}th",
    }
  });

  addTranslations('fr', {
    "messages": {
      "one": "Un message reçu, {{ name }}.",
      "other": "{{ cardinal }} messages reçus, {{ name }}.",
      "zero": "Aucun message reçu, {{ name }}."
    },
    "position": {
      "one": "Premier",
      "other": "{{ ordinal }}ème",
    }
  });

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    fallbackLanguageTag: 'en',
    keySeparator: ''
  });

  const [_locale, { setLanguageTag }] = useLocale();
  const translate = useI18n();

  expect(translate('messages', { cardinal: 1, name: 'John' })).toBe('One message received, John.');
  expect(translate('position', { ordinal: 1 })).toBe('1st');

  setLanguageTag('fr');

  expect(translate('messages', { cardinal: 1, name: 'John' })).toBe('Un message reçu, John.');
  expect(translate('position', { ordinal: 1 })).toBe('Premier');
});

test('key separator', async () => {
  addTranslations('en', {
    "welcome": {
      "hello": "hello!",
      "messages": {
        "one": "One message received, {{ name }}.",
        "other": "{{ cardinal }} messages received, {{ name }}.",
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
        "other": "{{ cardinal }} messages reçus, {{ name }}.",
        "zero": "Aucun message reçu, {{ name }}."
      }
    },
    "world": "monde !"
  });

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    keySeparator: '.'
  });

  function Hello() {
    const [locale, { setLanguageTag }] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="hello">{translate('welcome.hello')}</div>
      <div data-testid="messages">{translate('welcome.messages', { cardinal: 1, name: 'John' })}</div>
      <div data-testid="world">{translate('world')}</div>
      <button data-testid="locale" onClick={() => setLanguageTag('fr')}>
        {locale.languageTag}
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

  expect(locale.textContent).toBe('fr');
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

  createLocalePrimitive({
    supportedLanguageTags: getSupportedLanguageTags()
  });
  createI18nPrimitive({
    keySeparator: ''
  });

  function Namespaced1() {
    const [locale, { setLanguageTag }] = useLocale();
    const translate = useI18n();
    return <>
      <div data-testid="global1">{translate('global')}</div>
      <div data-testid="hello1">{translate('hello')}</div>
      <div data-testid="world1">{translate('world')}</div>
      <button data-testid="locale" onClick={() => setLanguageTag('fr')}>
        {locale.languageTag}
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

  function Namespaced3() {
    const translate = useI18n();
    return <>
      <div data-testid="global3">{translate('global')}</div>
      <div data-testid="hello3">{translate('hello')}</div>
      <div data-testid="world3">{translate('world')}</div>
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

      <I18nProvider namespaces={['foo']}>
        <I18nProvider namespaces={['bar']}>
          <Namespaced3/>
        </I18nProvider>
      </I18nProvider>
    </>
  );

  const globalNs1 = screen.getByTestId('global1');
  const helloNs1 = screen.getByTestId('hello1');
  const worldNs1 = screen.getByTestId('world1');
  const globalNs2 = screen.getByTestId('global2');
  const helloNs2 = screen.getByTestId('hello2');
  const worldNs2 = screen.getByTestId('world2');
  const globalNs3 = screen.getByTestId('global3');
  const helloNs3 = screen.getByTestId('hello3');
  const worldNs3 = screen.getByTestId('world3');
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
  expect(globalNs3.textContent).toBe('something');
  expect(helloNs3.textContent).toBe('hello!');
  expect(worldNs3.textContent).toBe('world!');
  expect(global.textContent).toBe('something');
  expect(hello.textContent).toBe('hello...');
  expect(world.textContent).toBe('world...');

  fireEvent.click(locale);
  // the event loop takes one Promise to resolve to be finished
  await Promise.resolve();

  expect(locale.textContent).toBe('fr');
  expect(globalNs1.textContent).toBe('quelque chose');
  expect(helloNs1.textContent).toBe('bonjour !');
  expect(worldNs1.textContent).toBe('monde !');
  expect(globalNs2.textContent).toBe('quelque chose');
  expect(helloNs2.textContent).toBe('bonjour.');
  expect(worldNs2.textContent).toBe('monde.');
  expect(globalNs3.textContent).toBe('quelque chose');
  expect(helloNs3.textContent).toBe('bonjour !');
  expect(worldNs3.textContent).toBe('monde !');
  expect(global.textContent).toBe('quelque chose');
  expect(hello.textContent).toBe('bonjour...');
  expect(world.textContent).toBe('monde...');
});
