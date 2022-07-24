# `solid-compose`

## Functions

### `useColorScheme`

```typescript
import {
  ColorSchemeProvider,
  ColorSchemeStorage,
  ColorSchemeStylesheet
} from 'solid-compose';

const App: VoidComponent = () => {
  return (
    <ColorSchemeProvider storage={ColorSchemeStorage.localStorage}>
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

### `useLocalStorage`

```typescript
import { useLocalStorage } from 'solid-compose';

const [value, { set: setValue, remove: removeValue }] =  useLocalStorage<string>('myKey', 'defaultValue');
```

## Install

You can get `solid-compose` via [npm](http://npmjs.com).

```
npm install solid-compose
```
