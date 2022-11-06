# Solid Compose

`solid-compose` provides a set of reactive state for commonly used features for web apps.

Currently, it includes
* [internationalization (i18n)](#internationalization-i18n)
* [color scheme (dark, light mode)](#color-scheme-dark-light-mode)
* [localStorage (client-side storage)](#localstorage-client-side-storage)

## Internationalization (i18n)

Solid Compose provides i18n support allowing to build multilingual apps.

First, initialize and configure the locale and i18n global primitives:

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

Add your app's translations (this may also be done before creating the primitives):

```typescript
import { addTranslations } from 'solid-compose';

addTranslations('en' {
  "hello": "hello!",
  "world": "world!"
});

addTranslations('fr' {
  "hello": "bonjour !",
  "world": "monde !"
});

// from JSON files
// (make sure to have TS config "resolveJsonModule" set to true)

import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';

addTranslations('en', enTranslations);
addTranslations('fr', frTranslations);
```

Translate your app:

```typescript
import {
  useI18n,
  useLocale
} from 'solid-compose';

function Hello() {
  const [locale, setLocale] = useLocale();
  const translate = useI18n();

  return <>
    <div>{translate('hello')}</div>
    <div>Current locale: {locale()}</div>
    <div>Switch locale: {locale('fr')}</div>
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
    "other": "{{ count }} messages received.",
    "zero": "No messages received."
  }
});
```

A `count` parameter must be present when translating (you may not use another naming), for the library to pick the right message:

```typescript
translate('messages', { count: 1 }); // One message received.
```

### Namespaces

Namespaces allow to load only a subset of the available translations, which eases the handling of key collisions in larger apps.

Say for instance that your application is made of multiple sub-apps, you may have a "common" namespace including common translations for the all the sub-apps, and a namespace specific to a sub-app.

`addTranslations` optionally accepts as second argument a namespace:

```typescript
addTranslations('en', 'common', { // "common" namespace
  "hello": "hello!",
  "world": "world!"
});

addTranslations('fr', 'common', { // "common" namespace
  "hello": "bonjour !",
  "world": "monde !"
});
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

You may then add the `ColorSchemeStylesheet` component to your app which will pick the right stylesheet according to the current color scheme.

```typescript
import {
  ColorSchemeStylesheet
} from 'solid-compose';

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

* `storage`: data source from where the color scheme is retrieved. Built-in storages:
  * `ColorSchemeStorage.signalStorage`: retrieves the color scheme from a signal.
  * `ColorSchemeStorage.localStorage`: retrieves the color scheme from local storage.
  * `ColorSchemeStorage.mediaQuery`: retrieve the color scheme from the media query, setter throws an error.
  * `ColorSchemeStorage.queryString`: retrieves the color scheme from the URL's query parameter `color-scheme`.

  You may also pass a signal if you want to manage the color scheme via external state.

* `default`: the default color scheme to be used if non is found. Ignored for the mediaQuery strategy.
  If `default` has not been specified, the default color scheme from the [system or user agent](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) is used.

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

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
