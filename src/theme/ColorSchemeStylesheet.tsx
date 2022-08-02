import { Show, VoidComponent } from 'solid-js';
import { Portal } from "solid-js/web";
import useColorScheme from './useColorScheme';

interface Props {
  dark: string;
  light: string;
}

const ColorSchemeLink: VoidComponent<Props> = (props) => {
  const [colorScheme, _] = useColorScheme();

  return (
    <Portal mount={document.head}>
      <Show
        when={colorScheme() === 'dark'}
        fallback={<link rel="stylesheet" href={props.light} />}
      >
        <link rel="stylesheet" href={props.dark} />
      </Show>
    </Portal>
  );
};

export default ColorSchemeLink;
