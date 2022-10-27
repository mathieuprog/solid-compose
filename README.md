# `solid-compose`

## `useI18n`

### Global state

```typescript
import {
  createI18nPrimitive,
  createLocalePrimitive,
  setFallbackLocalesForMissingTranslations
} from 'solid-compose';

createLocalePrimitive({ default: 'en' });
createI18nPrimitive();
setFallbackLocalesForMissingTranslations(['en']);
```

```typescript
import {
  useGlobal18n,
  useLocale
} from 'solid-compose';

function Hello() {
  const [locale, setLocale] = useLocale();
  const translate = useGlobal18n();

  return <>
    <div>{translate('hello')}</div>
    <div>Current locale: {locale()}</div>
    <div>Switch locale: {locale('fr')}</div>
  </>;
}
```

### Context

```typescript
import {
  createLocalePrimitive,
  setFallbackLocalesForMissingTranslations
} from 'solid-compose';

createLocalePrimitive({ default: 'en' });
setFallbackLocalesForMissingTranslations(['en']);
```

```typescript
import { I18nProvider } from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <I18nProvider namespaces={['foo', 'bar']>
      <Hello/>
    </I18nProvider>
  );
};
```

```typescript
import {
  useContext18n,
  useLocale
} from 'solid-compose';

function Hello() {
  const [locale, setLocale] = useLocale();
  const translate = useContext18n();

  return <>
    <div>{translate('hello')}</div>
    <div>Current locale: {locale()}</div>
    <div>Switch locale: {locale('fr')}</div>
  </>;
}
```

### Namespaces

Namespaces allow to load a subset of the available translations, which eases the handling of key collisions in larger apps.

Say for instance that your application is made of multiple sub-apps, you may have a "common" namespace including common translations for the all the sub-apps, and a namespace specific to a sub-app.

### Add translations

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

addTranslations('en', 'common', { // "common" namespace
  "hello": "hello!",
  "world": "world!"
});

addTranslations('fr', 'common', { // "common" namespace
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

## `useColorScheme`

### Global state

```typescript
createColorSchemePrimitive({
  default: 'dark',
  storage: ColorSchemeStorage.signalStorage
});
```

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

```typescript
import { useGlobalColorScheme } from 'solid-compose';

const [colorScheme, setColorScheme] = useGlobalColorScheme();
```

### Context

```typescript
import {
  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet
} from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <ColorSchemeProvider storage={ColorSchemeStorage.localStorage} default="dark">
      <ColorSchemeStylesheet
        dark="./css/themes/dark-theme.css"
        light="./css/themes/light-theme.css"
      />
      <div>…</div>
    </ColorSchemeProvider>
  );
};
```

```typescript
import { useContextColorScheme } from 'solid-compose';

const [colorScheme, setColorScheme] = useContextColorScheme();
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
