import type { VoidComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { getThemePath } from './themes';
import useTheme from './useTheme';

const ThemeStylesheet: VoidComponent = () => {
  const [theme] = useTheme();
  const themePath = getThemePath(theme());

  return (
    <>
      <Portal mount={document.head}>
        <link rel="stylesheet" href={themePath} />
      </Portal>
      <div data-testid={`stylesheet-${theme()}`} />
    </>
  );
};

export default ThemeStylesheet;
