import { numberParser } from 'user-locale';
import useLocale from './useLocale';

export default function parseNumber(localizedNumberString: string, options?: { allowThousandSeparator?: boolean, precision?: number }) {
  const [locale] = useLocale();

  return numberParser(locale.numberFormat)(localizedNumberString, options);
}
