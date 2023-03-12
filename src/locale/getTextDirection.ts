import isPartOfLanguageTag from "./isPartOfLanguageTag";

const rtlLanguageTags = [
  'ar', 'dv', 'fa', 'ha', 'he',
  'ks', 'ku', 'ps', 'ur', 'yi'
];

export default function getTextDirection(languageTag: string) {
  if (rtlLanguageTags.includes(languageTag)) {
    return 'rtl';
  }

  const isRtl = rtlLanguageTags.find((rtlLanguageTag) => {
    return isPartOfLanguageTag(languageTag, rtlLanguageTag);
  });
  
  return (isRtl) ? 'rtl' : 'ltr';
}
