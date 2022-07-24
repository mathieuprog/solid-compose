export default function getSystemColorScheme() {
  return (window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light';
}
