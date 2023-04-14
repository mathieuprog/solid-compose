# Solid Compose

`solid-compose` provides a set of reactive state for commonly used features in web apps.

Currently, it includes
* [internationalization (i18n)](#internationalization-i18n)
* [localStorage (client-side storage)](#localstorage-client-side-storage)
* [localization (l10n)](#localization-l10n)
  * [color scheme (dark, light mode)](#color-scheme-dark-light-mode)
  * [language tag](#language-tag)
  * [number format](#number-format)
  * [date format](#date-format)
  * [time format](#time-format)
  * [time zone](#time-zone)
  * [first day of the week](#first-day-of-the-week)
  * [text direction](#text-direction)
* [theming](#theming)
* [viewport](#viewport)
* [developer utilities](#developer-utilities)

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
  createLocalePrimitive,
  getSupportedLanguageTags
} from 'solid-compose';

createLocalePrimitive({
  // getSupportedLanguageTags() returns the language tags
  // for which translations exist
  supportedLanguageTags: getSupportedLanguageTags()
});

createI18nPrimitive({
  fallbackLanguageTag: 'en'
});
```

`createI18nPrimitive` accepts 2 optional configuration params:
* `fallbackLanguageTag`: the locale to fallback to if no translation is found for the current locale;
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
    fallbackLanguageTag: 'en',
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
  const [locale, { setLanguageTag }] = useLocale();
  const translate = useI18n();

  return <>
    <div>{translate('hello', { name: 'John' })}</div>
    <div>Current locale: {locale.languageTag}</div>
    <div>Switch locale: {setLanguageTag('fr')}</div>
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

To translate in a given language rather than the current locale, you may pass the locale as a third argument:

```typescript
translate('hello', { user: { name: 'John' }}, 'fr')
```

### Pluralization support

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

## Localization (l10n)

Solid Compose stores user locale parameters into a store.

First, initialize and configure the locale primitive:

```typescript
import { createLocalePrimitive } from 'solid-compose';

createLocalePrimitive({
  supportedLanguageTags: ['en', 'de', 'fr'],
  defaultLanguageTag: 'de'
});
```

The `supportedLanguageTags` configuration field is mandatory and specifies which language tags are supported by your application. The `defaultLanguageTag` field is optional and utilized if the user's preferred language tag is not included in `supportedLanguageTags` field.

You may then access the locale parameters:

```typescript
import { useLocale } from 'solid-compose';

const [locale] = useLocale();

console.log(locale.languageTag);
console.log(locale.textDirection);
console.log(locale.numberFormat);
console.log(locale.timeZone);
console.log(locale.dateFormat);
console.log(locale.timeFormat);
console.log(locale.firstDayOfWeek);
console.log(locale.colorScheme);
```

All of those parameters are reactive.

<details>
  <summary>How is the initial language tag determined ?</summary>

  The library looks for a language tag that is both supported by your application (in `supportedLanguageTags` configuration) and listed in the user's browser as one of their preferred language tags (in `navigator.languages`).

  If a matching language tag cannot be found, the optional `defaultLanguageTag` configuration is utilized. If not provided, either an English language tag is used or the first language tag in the list of supported language tags.
</details>

When you have information about the user's preferences, you can use it to initialize the locale data:

```typescript
import { createLocalePrimitive } from 'solid-compose';

createLocalePrimitive({
  supportedLanguageTags: ['en', 'de', 'fr'],
  defaultLanguageTag: 'de',
  initialValues: {
    languageTag: user.languageTag,
    numberFormat: user.numberFormat,
    timeZone: user.timeZone,
    dateFormat: user.dateFormat,
    timeFormat: user.timeFormat,
    firstDayOfWeek: user.firstDayOfWeek,
    colorScheme: user.colorScheme
  }
});
```

Every field in `initialValues` is optional and if not provided, the value is inferred from the user's browser and system parameters.

### Color scheme (dark, light mode)

Solid Compose provides color scheme toggling (light vs dark mode).

You may then add the `ColorSchemeStylesheet` component in your app which will pick the right stylesheet according to the current color scheme.

```jsx
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

In addition to adding the necessary stylesheets, it also includes the `color-scheme` meta tag, the CSS styling property `color-scheme` on the html tag, as well as a data attribute `"data-color-scheme"` on the html tag.

The data attribute enables the selection of CSS selectors based on the color scheme, allowing you to set CSS variables for the current color scheme:
```css
html[data-color-scheme='dark'] {
  --primary-text-color: var(--grey-200);
  --secondary-text-color: var(--grey-500);
}
```

`setColorScheme` allows to switch the color scheme:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setColorScheme }] = useLocale();
```

The initial color scheme is derived from the [system or user agent](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme), unless the `initialValues` include a `colorScheme` property.

If you intend to incorporate additional themes beyond just the dark and light modes, refer to the [Theming](#theming).

### Language tag

`setLanguageTag` allows to change the language:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setLanguageTag }] = useLocale();
```

### Number format

`setNumberFormat` allows to change the number format:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setNumberFormat }] = useLocale();
```

`formatNumber` allows to format a number according to the current locale's number formatting setting.

```typescript
import { formatNumber, useLocale } from 'solid-compose';

const [locale, { setNumberFormat }] = useLocale();

setNumberFormat(NumberFormat.SpaceComma);

formatNumber(1000.01) // 1 000,01
```

### Date format

`setDateFormat` allows to change the date format:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setDateFormat }] = useLocale();
```

### Time format

`setTimeFormat` allows to change the time format:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setTimeFormat }] = useLocale();
```

### Time zone

`setTimeZone` allows to change the time zone:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setTimeZone }] = useLocale();
```

### First day of the week

`setFirstDayOfWeek` allows to change the first day of the week:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setFirstDayOfWeek }] = useLocale();
```

### Text direction

`createTextDirectionEffect` function allows the text direction of the entire page to be changed by setting the `dir` attribute on the `html` tag to `"ltr"` or `"rtl"` based on the current locale:

```typescript
import { createTextDirectionEffect } from 'solid-compose';

createTextDirectionEffect();
```

## Theming

Solid Compose provides theming support.

First, initialize and configure the locale primitive (in order to fetch the user's preferred color scheme):

```typescript
createLocalePrimitive({ supportedLanguageTags: ['en'] });
```

Then, initialize and configure the theme primitive:

```typescript
createThemePrimitive({
  themes: [
    {
      name: 'fooTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Dark,
      default: true
    },
    {
      name: 'barTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Light,
      default: true
    },
    {
      name: 'bazTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Dark
    }
  ]
});
```

The initial theme is selected according to the user's preferred color scheme. You therefore need to specify one default dark theme and one default light theme.

In cases where the theme is based on a color that is not distinctly dark or light, it is still needed to specify a default color scheme in case of missing styles.

When you know the user's preferred theme, you don't need to specify any defaults and instead you may set the user's theme via the `initialTheme` config:

```typescript
createThemePrimitive({
  themes: [
    {
      name: 'fooTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Dark
    },
    {
      name: 'barTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Light
    },
    {
      name: 'bazTheme',
      path: 'https://example.com',
      colorScheme: ColorScheme.Dark
    }
  ],
  initialTheme: 'fooTheme'
});
```

You may then add the `ThemeStylesheet` component in your app which will pick the right stylesheet according to the selected theme.

```jsx
import { ThemeStylesheet } from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <>
      <ThemeStylesheet />

      <div>…</div>
    </>
  );
};
```

In addition to adding the necessary stylesheets, it also includes the `color-scheme` meta tag, the CSS styling property `color-scheme` on the html tag, as well as the data attributes `"data-color-scheme"` and `"data-theme"` on the html tag.

The data attributes enables the selection of CSS selectors based on the color scheme, allowing you to set CSS variables for the current theme:
```css
html[data-theme='my-theme'] {
  --primary-text-color: var(--grey-200);
  --secondary-text-color: var(--grey-500);
}
```

`setTheme` allows to switch the theme:

```typescript
import { useTheme } from 'solid-compose';

const [theme, setTheme] = useTheme();
```

## Viewport

Solid Compose allows to listen for changes to the viewport dimension and orientation.

First, initialize and configure the viewport primitive:

```typescript
import { createViewportPrimitive } from 'solid-compose';

createViewportPrimitive({
  widthSwitchpoints: {
    small: { // width < 768
      max: 768
    },
    medium: { // 768 <= width < 1280
      min: 768,
      max: 1280
    },
    large: { // 1280 <= width
      min: 1280
    },
  }
});
```

`createViewportPrimitive()` allows you to configure two properties: `widthSwitchpoints` and `heightSwitchpoints`. Both of these properties are objects that let you define custom size names and corresponding size ranges for the viewport dimensions.

The keys in each object represent the custom name for the size, while the values are sub-objects containing `min` and/or `max` allowing you to configure the switchpoints for either width or height.

You may then get the current viewport size and orientation and listen for changes:

```typescript
import { useViewport, ViewportOrientation } from 'solid-compose';

const viewport = useViewport();

console.log(viewport.width); // "large"
console.log(viewport.height); // undefined (height switchpoint names not defined in the config object)
console.log(viewport.orientation === ViewportOrientation.Landscape);
```

You may define your custom switchpoints names with TypeScript enums in order to catch errors when comparing width and height values:

```typescript
export enum Viewport {
  SmallWidth =  'SMALL_WIDTH',
  MediumWidth = 'MEDIUM_WIDTH',
  LargeWidth = 'LARGE_WIDTH'
}

createViewportPrimitive({
  widthSwitchpoints: {
    [Viewport.SmallWidth]: {
      max: 768
    },
    [Viewport.MediumWidth]: {
      min: 768,
      max: 1280
    },
    [Viewport.LargeWidth]: {
      min: 1280
    },
  }
});

const viewport = useViewport();

if (viewport.width === Viewport.SmallWidth) {
  // ...
}
```

## Developer utilities

`addLocaleHotkeyListener()` simplifies the testing of web interfaces that support multiple locale settings by allowing developers to quickly switch between different locales using customizable hotkeys. This enables you to switch between the following settings with ease:

* Color schemes
* Themes
* Languages
* Text directions
* Number formats
* Time zones
* Date formats
* Time formats
* First day of the week

To use addLocaleHotkeyListener(), simply pass in the hotkeys as optional functions, as shown in the code snippet below. Each hotkey is optional, so if you don't need to test a particular locale setting, simply omit it.

```typescript
import { addLocaleHotkeyListener } from 'solid-compose';

addLocaleHotkeyListener({
  hotkeys: {
    colorScheme: (e) => e.shiftKey && e.code === 'KeyQ',
    theme: (e) => e.shiftKey && e.code === 'KeyW',
    languageTag: (e) => e.shiftKey && e.code === 'KeyA',
    textDirection: (e) => e.shiftKey && e.code === 'KeyS',
    numberFormat: (e) => e.shiftKey && e.code === 'KeyD',
    timeZone: (e) => e.shiftKey && e.code === 'KeyZ',
    dateFormat: (e) => e.shiftKey && e.code === 'KeyX',
    timeFormat: (e) => e.shiftKey && e.code === 'KeyC',
    firstDayOfWeek: (e) => e.shiftKey && e.code === 'KeyV',
  },
  timeZones: ['Asia/Bangkok', 'Europe/London']
});
```

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
