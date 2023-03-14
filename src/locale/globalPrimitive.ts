import { ColorScheme, DateFormat, FirstDayOfWeek, TimeFormat } from 'user-locale';
import { SettableLocaleProps } from './createLocalePrimitive';
import TextDirection from './TextDirection';

export type LocalePrimitive = [Getters, Setters];

type Getters = {
  supportedLanguageTags: string[];
  languageTag: string;
  textDirection: TextDirection;
  timeZone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  firstDayOfWeek: FirstDayOfWeek;
  colorScheme: ColorScheme;
};

type Setters = {
  setLanguageTag: Setter<string>;
  setTimeZone: Setter<string>;
  setDateFormat: Setter<DateFormat>;
  setTimeFormat: Setter<TimeFormat>;
  setFirstDayOfWeek: Setter<FirstDayOfWeek>;
  setColorScheme: Setter<ColorScheme>;
  setLocale: (props: SettableLocaleProps) => void;
  __setTextDirection: Setter<TextDirection>;
};

export type Setter<T> =
  ((value: T) => void)
  & ((callback: ((prevValue: T | null) => T)) => void);

let primitive: LocalePrimitive;

export function setPrimitive(primitive_: LocalePrimitive) {
  primitive = primitive_;
}

export function getPrimitive(): LocalePrimitive {
  return primitive;
}
