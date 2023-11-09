import useLocale from './useLocale';

export default function getClosestSupportedLanguageTag(languageTag_: string | null) {
  const [locale] = useLocale();

  const supportedTags = locale.supportedLanguageTags;
  if (supportedTags.length === 0) {
    throw new Error('no supported language tags found');
  }

  const languageTag = languageTag_ || 'en';

  if (supportedTags.includes(languageTag)) {
    return languageTag;
  }

  const primarySubtag = languageTag.split('-')[0];

  let foundTag =
    supportedTags.find(supportedTag => languageTag.startsWith(supportedTag))
    || supportedTags.find(supportedTag => supportedTag.startsWith(languageTag))
    || supportedTags.find(supportedTag => supportedTag.startsWith(primarySubtag))
    || supportedTags.find(supportedTag => supportedTag === 'en')
    || supportedTags.find(supportedTag => supportedTag === 'en-US')
    || supportedTags.find(supportedTag => supportedTag === 'en-GB');

  if (!foundTag) {
    throw new Error('no default language tag found');
  }

  return foundTag;
}
