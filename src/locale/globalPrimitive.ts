import { ColorScheme, DateEndianness, FirstDayOfWeek } from 'user-locale';

export type LocalePrimitive = [Getters, Setters];

type Getters = {
  languageTag: string;
  supportedLanguageTags: string[];
  timeZone: string;
  dateFormat: {
    endianness: DateEndianness;
    separator: string;
  };
  timeFormat: {
    is24HourClock: boolean;
    separator: string;
  };
  firstDayOfWeek: FirstDayOfWeek;
  colorScheme: ColorScheme;
};

type Setters = {
  setLanguageTag: Setter<string>;
  setTimeZone: Setter<string>;
  setDateEndianness: Setter<DateEndianness>;
  setDateSeparator: Setter<string>;
  set24HourClock: Setter<boolean>;
  setTimeSeparator: Setter<string>;
  setFirstDayOfWeek: Setter<FirstDayOfWeek>;
  setColorScheme: Setter<ColorScheme>;
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
