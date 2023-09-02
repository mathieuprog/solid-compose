import { timeFormatter } from 'user-locale';
import { Temporal } from '@js-temporal/polyfill';
import useLocale from './useLocale';

interface TimeFormatterOptions {
  precision: 'minute' | 'second';
  omitZeroUnits?: boolean;
}

export default function formatTime(time: Temporal.PlainTime | Temporal.PlainDateTime, options: TimeFormatterOptions) {
  const [locale] = useLocale();

  return timeFormatter(locale.timeFormat, options)(time);
}
