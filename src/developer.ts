import { ColorScheme, DateEndianness, FirstDayOfWeek } from 'user-locale';
import TextDirection from './locale/TextDirection';
import useLocale from './locale/useLocale';
import { getThemes } from './theme/themes';
import useTheme from './theme/useTheme';

interface Config {
  timeZones?: string[];
}

export function addLocaleHotkeyListener(config: Config = {}) {
  document.addEventListener('keyup', function(event) {
    const [locale, {
      setColorScheme,
      setLanguageTag,
      setTimeZone,
      setTimeFormat,
      setDateFormat,
      setFirstDayOfWeek,
      __setTextDirection
    }] = useLocale();

    const [_theme, setTheme] = useTheme();

    if ((event.metaKey || event.ctrlKey) && event.key === 'q') {
      setColorScheme((prev) => {
        return prev === ColorScheme.Dark ? ColorScheme.Light : ColorScheme.Dark;
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
      setTheme((prev) => {
        return getNextValueInArray(getThemes().map((theme) => theme.name), prev);
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
      setLanguageTag((prev) => {
        return getNextValueInArray(locale.supportedLanguageTags, prev);
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      __setTextDirection((prev) => {
        return prev === TextDirection.LeftToRight ? TextDirection.RightToLeft : TextDirection.LeftToRight;
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      setTimeZone((prev) => {
        return (config.timeZones !== undefined)
          ? getNextValueInArray(config.timeZones, prev)
          : prev; 
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'x') {
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

    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
      setTimeFormat((prev) => {
        return prev.is24HourClock
          ? { is24HourClock: false, separator: prev.separator } 
          : { is24HourClock: true, separator: prev.separator };
      });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
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
