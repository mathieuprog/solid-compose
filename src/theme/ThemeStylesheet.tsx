import type { VoidComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { getThemeDetails } from './themes';
import useTheme from './useTheme';

const ThemeStylesheet: VoidComponent = () => {
  const [theme] = useTheme();
  const themeDetails = () => getThemeDetails(theme());

  return (
    <Portal mount={document.head}>
      <link rel="stylesheet" href={themeDetails().path} />
    </Portal>
  );
};

export default ThemeStylesheet;
