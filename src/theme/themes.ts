import type { Theme } from './createThemePrimitive';

let themes: Theme[];

export function setThemes(themes_: Theme[]) {
  themes = themes_;
}

export function getThemeDetails(themeName: string) {
  const theme = themes.find((theme) => theme.name === themeName);

  if (!theme) {
    throw new Error();
  }

  return theme;
}

export function getThemes() {
  return themes;
}
