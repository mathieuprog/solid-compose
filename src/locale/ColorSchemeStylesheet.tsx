import { createEffect } from 'solid-js';
import type { VoidComponent } from 'solid-js';
import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { ColorScheme } from 'user-locale';
import { useLocale } from '..';

interface Props {
  dark: string;
  light: string;
}

const ColorSchemeStylesheet: VoidComponent<Props> = (props) => {
  const [locale] = useLocale();

  createEffect(() => {
    const colorSchemePropertyValue = getColorSchemePropertyValue(locale.colorScheme);

    document.documentElement.style.setProperty('color-scheme', colorSchemePropertyValue);

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
        <Show
          when={locale.colorScheme === ColorScheme.Dark}
          fallback={<link rel="stylesheet" href={props.light} />}
        >
          <link rel="stylesheet" href={props.dark} />
        </Show>
      </Portal>
      <div data-testid={`stylesheet-${locale.colorScheme}`} />
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

export default ColorSchemeStylesheet;
