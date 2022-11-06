import { createSignal } from 'solid-js';
import getDefaultLocale from './getDefaultLocale';
import { setPrimitive } from './globalPrimitive';
import type { LocaleSetter } from './globalPrimitive';

interface Config {
  default?: string;
}

let defaultLocale: string = getDefaultLocale();

export default function createLocalePrimitive(config?: Config) {
  defaultLocale = config?.default ?? defaultLocale;

  const [locale, setLocale] = createSignal(defaultLocale);

  const setLocale_: LocaleSetter = (arg) => {
    if (typeof arg === 'function') {
      setLocale(arg(locale()));
    } else {
      setLocale(arg);
    }
  };

  setPrimitive([locale, setLocale_]);
}
