# Solid Compose

`solid-compose` provides a set of reactive state for commonly used features in web apps.

Currently, it includes
* [internationalization (i18n)](#internationalization-i18n)
* [color scheme (dark, light mode)](#color-scheme-dark-light-mode)
* [localStorage (client-side storage)](#localstorage-client-side-storage)

## Internationalization (i18n)

Solid Compose provides i18n support allowing to build multilingual apps.

First, add your app's translations:

```typescript
import { addTranslations } from 'solid-compose';

addTranslations('en' {
  "hello": "Hello, {{ name }}!"
});

addTranslations('fr' {
  "hello": "Bonjour, {{ name }} !",
});

// from JSON files
// (make sure to have TS config "resolveJsonModule" set to true)

import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';

addTranslations('en', enTranslations);
addTranslations('fr', frTranslations);
```

Then initialize and configure the locale and i18n global primitives:

```typescript
import {
  createI18nPrimitive,
  createLocalePrimitive
} from 'solid-compose';

createLocalePrimitive({
  default: 'en'
});

createI18nPrimitive({
  fallbackLocales: ['en']
});
```

`createI18nPrimitive` accepts 2 optional configuration params:
* `fallbackLocales`: the locales to fallback to if no translation is found for the current locale;
* `keySeparator`: allows to have nested translations.
<details>
  <summary>Example using keySeparator</summary>

  ```typescript
  addTranslations('fr', {
    "welcome": {
      "hello": "Bonjour !"
    }
  });

  createI18nPrimitive({
    fallbackLocales: ['en'],
    keySeparator: '.'
  });

  translate('welcome.hello') // Bonjour !
  ```
</details>
<br/>
Translate your app:

```typescript
import { useI18n, useLocale } from 'solid-compose';

function Hello() {
  const [locale, setLocale] = useLocale();
  const translate = useI18n();

  return <>
    <div>{translate('hello', { name: 'John' })}</div>
    <div>Current locale: {locale()}</div>
    <div>Switch locale: {locale('fr')}</div>
  </>;
}
```

You may also have objects as parameters:

```typescript
addTranslations('en' {
  "hello": "Hello, {{ user.name }}!"
});

function Hello() {
  const translate = useI18n();

  return <>
    <div>{translate('hello', { user: { name: 'John' }})}</div>
  </>;
}
```

### Multilingual support

Languages have different rules for plurals.

Solid Compose allows you to define a translation per plural rule:

```typescript
addTranslations('en', {
  "messages": {
    "one": "One message received.",
    "other": "{{ cardinal }} messages received.",
    "zero": "No messages received."
  },
  "position": {
    "one": "{{ ordinal }}st",
    "two": "{{ ordinal }}nd",
    "few": "{{ ordinal }}rd",
    "other": "{{ ordinal }}th",
  }
});
```

Either a `cardinal` or `ordinal` parameter must be present when translating, for the library to pick the right message:

```typescript
translate('messages', { cardinal: 1 }); // One message received.
```

```typescript
translate('position', { ordinal: 1 }); // 1st
```

### Namespaces

Namespaces allow to load only a subset of the available translations, which eases the handling of key collisions in larger apps.

Say for instance that your application is made of multiple sub-apps, you may have a "todo" namespace including the translations for the todo sub-app, a "scheduler" namespace for the scheduler sub-app, etc.

`addTranslations` optionally accepts as second argument a namespace:

```typescript
addTranslations('en', {
  // common translations
});

addTranslations('en', 'todo', {
  // translations for the todo app
});

addTranslations('en', 'scheduler', {
  // translations for the scheduler app
});

addTranslations('en', 'time', {
  // translations related to time
});
```

You may then use the `I18nProvider` component to scope the translations per namespace:

```typescript
import { I18nProvider } from 'solid-compose';

render(() =>
  <>
    <I18nProvider namespaces={['todo']}>
      <TodoApp/>
    </I18nProvider>

    <I18nProvider namespaces={['time', 'scheduler']}>
      <SchedulerApp/>
    </I18nProvider>
  </>
);
```

## Color scheme (dark, light mode)

Solid Compose provides color scheme toggling (light vs dark mode).

First, initialize and configure the color scheme primitive:

```typescript
import {
  ColorScheme,
  ColorSchemeStorage,
  createColorSchemePrimitive
} from 'solid-compose';

createColorSchemePrimitive({
  default: ColorScheme.Dark,
  storage: ColorSchemeStorage.localStorage
});
```

You may then add the `ColorSchemeStylesheet` component in your app which will pick the right stylesheet according to the current color scheme.

```typescript
import { ColorSchemeStylesheet } from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <>
      <ColorSchemeStylesheet
        dark="./css/themes/dark-theme.css"
        light="./css/themes/light-theme.css"
      />
      <div>…</div>
    </>
  );
};
```

Call `setColorScheme` in order to switch the color scheme:

```typescript
import { useColorScheme } from 'solid-compose';

const [colorScheme, setColorScheme] = useColorScheme();
```

`createColorSchemePrimitive` accepts 2 configuration params:

### `storage` option

Indicates the data source from where the color scheme is retrieved. Built-in storages are:
* `signalStorage`: retrieves the color scheme from a signal.
* `localStorage`: retrieves the color scheme from localStorage.
* `mediaQuery`: retrieves the color scheme from the media query, setter throws an error.
* `queryString`: retrieves the color scheme from the URL's query parameter `"color-scheme"`.

You may also pass an external signal if you want to manage the color scheme via external state:

```typescript
const mySignal = createSignal<ColorScheme>(ColorScheme.Dark);

createColorSchemePrimitive({
  storage: mySignal
});
```

### `default` option

Indicates the default color scheme to be used if none is found. Ignored for the mediaQuery strategy.

If a `default` has not been specified, the default color scheme from the [system or user agent](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) is used.

### Custom storage strategy

You may pass your own custom storage strategy to `ColorSchemeProvider`.
As an example, below is the code of the `signalStorage` strategy:
```javascript
import { getSystemColorScheme } from 'solid-compose';

const signalStorage = (defaultValue) => {
  return createSignal(defaultValue || getSystemColorScheme());
}
```

## localStorage (client-side storage)

Solid Compose makes localStorage values reactive:

```typescript
import { useLocalStorage } from 'solid-compose';

const [value, { set: setValue, remove: removeValue }] =
  useLocalStorage<string>('myKey', 'defaultValue');
```

`useLocalStorage` accepts as 3rd argument an object containing the functions serializing and deserializing values to be stored and to be retrieved.

By default, the following object is used:

```typescript
{
  serialize: JSON.stringify,
  deserialize: JSON.parse
}
```

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
