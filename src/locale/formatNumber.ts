import { numberFormatter } from 'user-locale';
import useLocale from './useLocale';

export default function formatNumber(number: number | string, options: { [key: string]: unknown } = {}) {
  const [locale] = useLocale();

  return numberFormatter(locale.numberFormat)(number, options);
}
