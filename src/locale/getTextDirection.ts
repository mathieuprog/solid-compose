import isPartOfLanguageTag from './isPartOfLanguageTag';
import TextDirection from './TextDirection';

const rtlLanguageTags = [
  'ar', 'dv', 'fa', 'ha', 'he',
  'ks', 'ku', 'ps', 'ur', 'yi'
];

export default function getTextDirection(languageTag: string) {
  if (rtlLanguageTags.includes(languageTag)) {
    return TextDirection.RightToLeft;
  }

  const isRtl = rtlLanguageTags.find((rtlLanguageTag) => {
    return isPartOfLanguageTag(languageTag, rtlLanguageTag);
  });
  
  return (isRtl) ? TextDirection.RightToLeft : TextDirection.LeftToRight;
}
