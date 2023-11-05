import { createEffect, createRoot } from 'solid-js';
import { ColorScheme } from 'user-locale';
import useLocale from './useLocale';

export default function createColorSchemeEffect() {
  const [locale] = useLocale();

  createRoot(() => {
    createEffect(() => {
      const colorSchemePropertyValue = getColorSchemePropertyValue(locale.colorScheme);

      document.documentElement.style.setProperty('color-scheme', colorSchemePropertyValue);
      document.documentElement.setAttribute('data-color-scheme', locale.colorScheme.toLowerCase());

      let meta = document.head.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;
      if (meta) {
        meta.content = colorSchemePropertyValue;
      } else {
        meta = document.createElement('meta');
        meta.name = 'color-scheme';
        meta.content = colorSchemePropertyValue;
        document.head.appendChild(meta);
      }
    });
  });
};

function getColorSchemePropertyValue(colorScheme: ColorScheme) {
  switch (colorScheme) {
    case ColorScheme.Light:
      return 'light';

    case ColorScheme.Dark:
      return 'dark';

    default:
      throw new Error();
  }
}
