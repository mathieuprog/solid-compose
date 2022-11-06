import type { Accessor } from 'solid-js';

export type Return<T> = [Accessor<T | null>, Setters<T>];

type Setters<T> = {
  set: (value: T) => void;
  remove: () => void;
};

const signalMap = new Map<string, Return<any>>();

export default signalMap;
