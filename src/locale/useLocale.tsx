import { Accessor, createSignal } from 'solid-js';
import getDefaultLocale from './getDefaultLocale';

export type LocalePrimitive = [Accessor<string>, LocaleSetter];

export type LocaleSetter =
  ((locale: string) => void)
  & ((callback: ((prevLocale: string | null) => string)) => void);

interface Config {
  default?: string;
}

let defaultLocale: string = getDefaultLocale();

let signal: LocalePrimitive;

export function createLocalePrimitive(config?: Config) {
  defaultLocale = config?.default ?? defaultLocale;

  const [locale, setLocale] = createSignal(defaultLocale);

  const setLocale_: LocaleSetter = (arg) => {
    if (typeof arg === 'function') {
      setLocale(arg(locale()));
    } else {
      setLocale(arg);
    }
  };

  signal = [locale, setLocale_];
}

export default function useLocale(): LocalePrimitive {
  if (!signal) {
    throw new Error('call createLocalePrimitive(config) to create the global state');
  }

  return signal;
}
