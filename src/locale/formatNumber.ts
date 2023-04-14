import { NumberFormat } from 'user-locale';
import useLocale from './useLocale';

export default function formatNumber(number: number) {
  const [locale] = useLocale();

  switch (locale.numberFormat) {
    case NumberFormat.CommaPeriod:
      return Intl.NumberFormat('en-US').format(number);

    case NumberFormat.PeriodComma:
      return Intl.NumberFormat('de-DE').format(number);

    case NumberFormat.SpaceComma:
      return Intl.NumberFormat('fr-FR').format(number);
  }
}
