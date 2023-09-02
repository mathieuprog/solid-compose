import { dateFormatter } from 'user-locale';
import { Temporal } from '@js-temporal/polyfill';
import useLocale from './useLocale';

export default function formatDate(date: Temporal.PlainDate | Temporal.PlainDateTime) {
  const [locale] = useLocale();

  return dateFormatter(locale.dateFormat)(date);
}
