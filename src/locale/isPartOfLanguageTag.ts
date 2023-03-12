export default function isPartOfLanguageTag(parentTag: string, tagToCheck: string) {
  if (parentTag === tagToCheck) {
    return true;
  }

  const parsedParentTag = parseLanguageTag(parentTag);
  const parsedTagToCheck = parseLanguageTag(tagToCheck);

  if (parsedParentTag.primaryLanguageSubtag !== parsedTagToCheck.primaryLanguageSubtag) {
    return false;
  }

  if (parsedTagToCheck.regionSubtag && parsedParentTag.regionSubtag !== parsedTagToCheck.regionSubtag) {
    return false;
  }

  if (parsedTagToCheck.languageSubtags.length <= 2) {
    return true;
  }

  if (parsedParentTag.languageSubtags.length < parsedTagToCheck.languageSubtags.length) {
    return false;
  }

  return parsedTagToCheck.languageSubtags.every((subtag) => {
    return parsedParentTag.languageSubtags.includes(subtag);
  });
}

function parseLanguageTag(languageTag: string) {
  const languageSubtags = languageTag.split('-');

  const primaryLanguageSubtag = languageSubtags[0];

  const regionSubtag =
    languageSubtags.find((subtag) => {
      return subtag.length === 2 && subtag.toUpperCase() === subtag
    });

  return { primaryLanguageSubtag, regionSubtag, languageSubtags };
}
