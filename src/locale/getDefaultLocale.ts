export default function getDefaultLocale() {
  return navigator.languages[0] || navigator.language || 'en';
}
