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

  return (
    <Portal mount={document.head}>
      <Show
        when={locale.colorScheme === ColorScheme.Dark}
        fallback={<link rel="stylesheet" href={props.light} />}
      >
        <link rel="stylesheet" href={props.dark} />
      </Show>
    </Portal>
  );
};

export default ColorSchemeStylesheet;
