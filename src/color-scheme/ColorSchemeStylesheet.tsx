import type { VoidComponent } from 'solid-js';
import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import ColorScheme from './ColorScheme';
import useColorScheme from './useColorScheme';

interface Props {
  dark: string;
  light: string;
}

const ColorSchemeStylesheet: VoidComponent<Props> = (props) => {
  const [colorScheme, _] = useColorScheme();

  return (
    <>
      <Portal mount={document.head}>
        <Show
          when={colorScheme() === ColorScheme.Dark}
          fallback={<link rel="stylesheet" href={props.light} />}
        >
          <link rel="stylesheet" href={props.dark} />
        </Show>
      </Portal>
      <div data-testid={`stylesheet-${colorScheme()}`} />
    </>
  );
};

export default ColorSchemeStylesheet;
