import ColorScheme from './ColorScheme';

export default function getSystemColorScheme() {
  return (window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? ColorScheme.Dark
    : ColorScheme.Light;
}
