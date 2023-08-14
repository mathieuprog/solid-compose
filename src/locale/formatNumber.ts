import { NumberFormat } from 'user-locale';
import useLocale from './useLocale';

export default function formatNumber(number: number, options: { [key: string]: unknown } = {}) {
  const [locale] = useLocale();

  switch (locale.numberFormat) {
    case NumberFormat.CommaPeriod:
      return Intl.NumberFormat('en-US', options).format(number);

    case NumberFormat.PeriodComma:
      return Intl.NumberFormat('de-DE', options).format(number);

    case NumberFormat.SpaceComma:
      return Intl.NumberFormat('fr-FR', options).format(number);
  }
}
