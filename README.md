# Solid Compose

`solid-compose` provides a set of reactive state for commonly used features in web apps.

Currently, it includes
* [internationalization (i18n)](#internationalization-i18n)
* [localStorage (client-side storage)](#localstorage-client-side-storage)
* [localization (l10n)](#localization-l10n)
  * [color scheme (dark, light mode)](#color-scheme-dark-light-mode)
  * [language tag](#language-tag)
  * [date format](#date-format)
  * [time format](#time-format)
  * [time zone](#time-zone)
  * [first day of the week](#first-day-of-the-week)
  * [text direction](#text-direction)

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

The `supportedLanguageTags` configuration field is mandatory and specifies which language tags are supported by your application.

When first initializing the locale primitive, the library looks for a language tag that is both supported by your application and listed in the user's browser as one of their preferred language tags.

If a matching preferred language tag cannot be found, the optional `defaultLanguageTag` configuration is utilized. If not provided, either an English language tag is used or the first language tag in the list of supported language tags.

You may then access the locale parameters:

```typescript
import { useLocale } from 'solid-compose';

const [locale] = useLocale();

console.log(locale.colorScheme);
console.log(locale.languageTag);
console.log(locale.textDirection);
console.log(locale.dateFormat);
console.log(locale.timeFormat);
console.log(locale.timeZone);
console.log(locale.firstDayOfWeek);
```

All those parameters are reactive.

### Color scheme (dark, light mode)

Solid Compose provides color scheme toggling (light vs dark mode).

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

`setColorScheme` allows to switch the color scheme:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setColorScheme }] = useLocale();
```

The initial color scheme is taken from the [system or user agent](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme).

This may be overridden by a default color scheme passed to `createLocalePrimitive` configuration:

```typescript
import {
  ColorScheme,
  createLocalePrimitive
} from 'solid-compose';

createLocalePrimitive({
  defaultColorScheme: ColorScheme.Dark,
  supportedLanguageTags: ['en']
});
```

### Language tag

`setLanguageTag` allows to change the language:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setLanguageTag }] = useLocale();
```

### Date format

`setDateEndianness` and `setDateSeparator` allow to change the date format:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { setDateEndianness, setDateSeparator }] = useLocale();
```

### Time format

`set24HourClock` and `setTimeSeparator` allow to change the time format:

```typescript
import { useLocale } from 'solid-compose';

const [locale, { set24HourClock, setTimeSeparator }] = useLocale();
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

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
