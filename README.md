# `solid-compose`

## `useI18n`

### Add the context

```typescript
import { I18nProvider } from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <I18nProvider locale="en-GB">
      <Hello/>
    </I18nProvider>
  );
};
```

### Fallback locales

When looking for a translation for a given key, the key is searched through the translations for the main locale, and if not found, for the the fallback locales. The locales are selected in that order:

1. the main locale as specified to `I18nProvider`'s `locale` prop, eg. `'en-GB'` (if the locale has not been specified, the user's preferred locale is used)
2. the shorter two-letter code, eg. `'en'`
3. the fallback locale as specified to `I18nProvider`'s `fallbackLocale` prop  (if the locale has not been specified, the user's preferred locale is used; set it no `null` to disable the `fallbackLocale`)
4. the `'en'` locale
5. the `'en-US'` locale
6. the `'en-GB'` locale
7. throw an error

### Namespaces

Namespaces allow to load a subset of the available translations, which eases the handling of key collisions in larger apps.

Say for instance that your application is made of multiple sub-apps, you may have a "common" namespace including common translations for the various sub-apps, and a namespace specific to a sub-app.

```typescript
import { I18nProvider } from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <I18nProvider locale="en" namespaces={["common", "todo-app"]}>
      <Hello/>
    </I18nProvider>
  );
};
```

### Add translations

```typescript
import { addTranslations } from 'solid-compose';

addTranslations("en" {
  "hello": "hello!",
  "world": "world!"
});

addTranslations("fr" {
  "hello": "bonjour !",
  "world": "monde !"
});

addTranslations("en", "common", { // "common" namespace
  "hello": "hello!",
  "world": "world!"
});

addTranslations("fr", "common", { // "common" namespace
  "hello": "bonjour !",
  "world": "monde !"
});
```

### Translate

```typescript
import { use18n } from 'solid-compose';

function Hello() {
  const [translate, locale] = use18n();

  return <>
    <div>{translate('hello')}</div>
    <div>Current locale: {locale()}</div>
    <div>Switch locale: {locale('fr')}</div>
  </>;
}
```

## `useColorScheme`

### Add the context

```typescript
import {
  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet
} from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <ColorSchemeProvider storage={ColorSchemeStorage.localStorage} defaultScheme="dark">
      <ColorSchemeStylesheet
        dark="./css/themes/dark-theme.css"
        light="./css/themes/light-theme.css"
      />
      <div>...</div>
    </ColorSchemeProvider>
  );
};
```

### Get and set the color scheme

```typescript
import { useColorScheme } from 'solid-compose';

const [colorScheme, setColorScheme] = useColorScheme();
```

### `ColorSchemeProvider` props

* `storage`: data source from where the color scheme is retrieved. Built-in storages:
  * `ColorSchemeStorage.signalStorage`: retrieves the color scheme from a signal.
  * `ColorSchemeStorage.localStorage`: retrieves the color scheme from local storage.
  * `ColorSchemeStorage.mediaQuery`: retrieve the color scheme from the media query, setter throws an error.
  * `ColorSchemeStorage.queryString`: retrieves the color scheme from the URL's query parameter `color-scheme`.

  You may also pass a signal if you want to manage the color scheme via external state.

* `defaultScheme`: the default color scheme to be used if non is found. Ignored for the mediaQuery strategy.
  If `defaultScheme` has not been specified, the default color scheme from the [system or user agent](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) is used.

### Custom storage strategy

You may pass your own custom storage strategy to `ColorSchemeProvider`.
As an example, below is the code of the `signalStorage` strategy:
```javascript
const signalStorage = (defaultValue) => {
  return createSignal(defaultValue || getSystemColorScheme());
}
```

## `useLocalStorage`

```typescript
import { useLocalStorage } from 'solid-compose';

const [value, { set: setValue, remove: removeValue }] =  useLocalStorage<string>('myKey', 'defaultValue');
```

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
