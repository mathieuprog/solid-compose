# `solid-compose`

## `useI18n`

```typescript
addTranslations("en", "common", {
  "hello": "hello!",
  "world": "world!"
});

addTranslations("fr", "common", {
  "hello": "bonjour!",
  "world": "monde!"
});
```

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
