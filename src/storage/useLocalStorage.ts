import createLocalStoragePrimitive from './createLocalStoragePrimitive';
import type { Transform } from './createLocalStoragePrimitive';
import signalMap from './primitives';
import type { Return } from './primitives';

export default function useLocalStorage<T>(key: string, defaultValue?: T, transform?: Transform<T>): Return<T> {
  let signal = signalMap.get(key);

  if (signal === undefined) {
    signal = createLocalStoragePrimitive(key, defaultValue, transform);
    signalMap.set(key, signal);
  }

  return signal;
}
