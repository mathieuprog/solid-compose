import type { Themes } from './createThemePrimitive';

let themes: Themes;

export function setThemes(themes_: Themes) {
  themes = themes_;
}

export function getThemePath(themeName: string): string {
  return themes[themeName];
}

export function getThemes() {
  return themes;
}
