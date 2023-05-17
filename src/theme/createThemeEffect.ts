import { createEffect, createRoot } from 'solid-js';
import { ColorScheme } from 'user-locale';
import { getThemeDetails } from './themes';
import useTheme from './useTheme';

export default function createThemeEffect() {
  const [theme] = useTheme();
  const themeDetails = () => getThemeDetails(theme());

  createRoot(() => {
    createEffect(() => {
      const colorSchemePropertyValue = getColorSchemePropertyValue(themeDetails().colorScheme);

      document.documentElement.style.setProperty('color-scheme', colorSchemePropertyValue);
      document.documentElement.setAttribute('data-color-scheme', themeDetails().colorScheme.toLowerCase());
      document.documentElement.setAttribute('data-theme', themeDetails().name);

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
      return 'only light';

    case ColorScheme.Dark:
      return 'dark light';

    default:
      throw new Error();
  }
}
