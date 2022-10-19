import type { VoidComponent } from 'solid-js';
import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import useContextColorScheme from './useColorScheme/context';
import useGlobalColorScheme from './useColorScheme/global';

interface Props {
  dark: string;
  light: string;
}

const ColorSchemeStylesheet: VoidComponent<Props> = (props) => {
  const [colorScheme, _] = useContextColorScheme() || useGlobalColorScheme();

  return (
    <>
      <Portal mount={document.head}>
        <Show
          when={colorScheme() === 'dark'}
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
