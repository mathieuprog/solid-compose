import type { Accessor } from 'solid-js';
import {
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

type Return<T> = [Accessor<T | null>, Setters<T>];

type Setters<T> = {
  set: (value: T) => void;
  remove: () => void;
};

const signalMap = new Map<string, Return<any>>();

export default function useLocalStorage<T>(key: string, defaultValue?: T, transform?: Transform<T>): Return<T> {
  let signal = signalMap.get(key);

  if (signal === undefined) {
    signal = createLocalStorageSignal(key, defaultValue, transform);
    signalMap.set(key, signal);
  }

  return signal;
}

export type Transform<T> = {
  serialize: (value: T) => string;
  deserialize: (str: string) => T;
};

const defaultTransform = {
  serialize: JSON.stringify,
  deserialize: JSON.parse
};

function createLocalStorageSignal<T>(key: string, defaultValue?: T, transform: Transform<T> = defaultTransform): Return<T> {
  const initialValue = getItemOrDefault<T>(key, transform, defaultValue);

  const [value, setValue] = createSignal(initialValue);

  onMount(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === key) {
        transform = {
          serialize: JSON.stringify,
          deserialize: JSON.parse
        };
        setValue(() => (event.newValue === null) ? null : transform.deserialize(event.newValue));
      }
    };

    window.addEventListener('storage', listener);

    onCleanup(() => {
      window.removeEventListener('storage', listener);
    });
  });

  const set = (value: T): void => {
    if (value === undefined || value === null) {
      throw new Error();
    }
    localStorage.setItem(key, transform.serialize(value));
    setValue(() => value);
  };

  const remove = (): void => {
    localStorage.removeItem(key);
    signalMap.delete(key);
    setValue(null);
  };

  return [value, { set, remove }];
}

function getItemOrDefault<T>(key: string, transform: Transform<T>, defaultValue?: T): T | null {
  let value = localStorage.getItem(key);

  if (value !== null) {
    try {
      transform.deserialize(value);
    } catch (_) {
      localStorage.removeItem(key);
      signalMap.delete(key);
      value = null;
    }
  }

  if (value === null) {
    if (defaultValue !== undefined && defaultValue !== null) {
      localStorage.setItem(key, transform.serialize(defaultValue));
      return defaultValue;
    }

    localStorage.removeItem(key);
    signalMap.delete(key);
    return null;
  }

  return transform.deserialize(value);
}
