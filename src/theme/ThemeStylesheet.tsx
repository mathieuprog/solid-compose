import { createEffect } from 'solid-js';
import type { VoidComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { ColorScheme } from 'user-locale';
import { getThemeDetails } from './themes';
import useTheme from './useTheme';

const ThemeStylesheet: VoidComponent = () => {
  const [theme] = useTheme();
  const themeDetails = () => getThemeDetails(theme());

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

  return (
    <>
      <Portal mount={document.head}>
        <link rel="stylesheet" href={themeDetails().path} />
      </Portal>
    </>
  );
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

export default ThemeStylesheet;
