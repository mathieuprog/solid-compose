import type { ColorScheme } from './useColorScheme';

export default function getSystemColorScheme(): ColorScheme {
  return (window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light';
}
