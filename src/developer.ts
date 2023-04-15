import { ColorScheme, DateEndianness, FirstDayOfWeek, NumberFormat } from 'user-locale';
import TextDirection from './locale/TextDirection';
import useLocale from './locale/useLocale';
import { getThemes } from './theme/themes';
import useTheme from './theme/useTheme';

interface Config {
  hotkeys: {
    colorScheme?: (e: KeyboardEvent) => boolean;
    theme?: (e: KeyboardEvent) => boolean;
    languageTag?: (e: KeyboardEvent) => boolean;
    textDirection?: (e: KeyboardEvent) => boolean;
    numberFormat?: (e: KeyboardEvent) => boolean;
    timeZone?: (e: KeyboardEvent) => boolean;
    dateFormat?: (e: KeyboardEvent) => boolean;
    timeFormat?: (e: KeyboardEvent) => boolean;
    firstDayOfWeek?: (e: KeyboardEvent) => boolean;
  }
  timeZones?: string[];
}

export function addLocaleHotkeyListener(config: Config) {
  document.addEventListener('keydown', function(event) {
    const [locale, {
      setColorScheme,
      setLanguageTag,
      setNumberFormat,
      setTimeZone,
      setTimeFormat,
      setDateFormat,
      setFirstDayOfWeek,
      __setTextDirection
    }] = useLocale();

    const [_theme, setTheme] = useTheme();

    if (config.hotkeys.colorScheme?.(event)) {
      setColorScheme((prev) => {
        return prev === ColorScheme.Dark ? ColorScheme.Light : ColorScheme.Dark;
      });
      return;
    }

    if (config.hotkeys.theme?.(event)) {
      setTheme((prev) => {
        return getNextValueInArray(getThemes().map((theme) => theme.name), prev);
      });
      return;
    }

    if (config.hotkeys.languageTag?.(event)) {
      setLanguageTag((prev) => {
        return getNextValueInArray(locale.supportedLanguageTags, prev);
      });
      return;
    }

    if (config.hotkeys.textDirection?.(event)) {
      __setTextDirection((prev) => {
        return prev === TextDirection.LeftToRight ? TextDirection.RightToLeft : TextDirection.LeftToRight;
      });
      return;
    }

    if (config.hotkeys.numberFormat?.(event)) {
      setNumberFormat((prev) => {
        return getNextValueInArray([
          NumberFormat.CommaPeriod,
          NumberFormat.PeriodComma,
          NumberFormat.SpaceComma
        ], prev);
      });
      return;
    }

    if (config.hotkeys.timeZone?.(event)) {
      setTimeZone((prev) => {
        return (config.timeZones !== undefined)
          ? getNextValueInArray(config.timeZones, prev)
          : prev;
      });
      return;
    }

    if (config.hotkeys.dateFormat?.(event)) {
      setDateFormat((prev) => {
        switch (prev.endianness) {
          case DateEndianness.LittleEndian:
            return { endianness: DateEndianness.MiddleEndian, separator: prev.separator };

          case DateEndianness.MiddleEndian:
            return { endianness: DateEndianness.BigEndian, separator: prev.separator };

          case DateEndianness.BigEndian:
            return { endianness: DateEndianness.LittleEndian, separator: prev.separator };
        }
      });
      return;
    }

    if (config.hotkeys.timeFormat?.(event)) {
      setTimeFormat((prev) => {
        return prev.is24HourClock
          ? { is24HourClock: false, separator: prev.separator }
          : { is24HourClock: true, separator: prev.separator };
      });
      return;
    }

    if (config.hotkeys.firstDayOfWeek?.(event)) {
      setFirstDayOfWeek((prev) => {
        const firstDaysOfWeek = [
          FirstDayOfWeek.Friday,
          FirstDayOfWeek.Monday,
          FirstDayOfWeek.Saturday,
          FirstDayOfWeek.Sunday
        ];
        return getNextValueInArray(firstDaysOfWeek, prev);
      });
      return;
    }
  });
}

function getNextValueInArray<T>(array: T[], currentValue: T): T {
  const index = array.findIndex((value) => value === currentValue);

  if (index === -1) {
    return array[0];
  }

  return array[(index === array.length - 1) ? 0 : index + 1];
}
