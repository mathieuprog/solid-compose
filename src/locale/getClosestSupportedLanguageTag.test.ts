import createLocalePrimitive from './createLocalePrimitive';
import getClosestSupportedLanguageTag from './getClosestSupportedLanguageTag';

test('getClosestSupportedLanguageTag', () => {
  createLocalePrimitive({ supportedLanguageTags: ['en'] });
  expect(getClosestSupportedLanguageTag(null)).toBe('en');

  createLocalePrimitive({ supportedLanguageTags: ['fr'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('fr');

  createLocalePrimitive({ supportedLanguageTags: ['fr'] });
  expect(getClosestSupportedLanguageTag('fr-BE')).toBe('fr');

  createLocalePrimitive({ supportedLanguageTags: ['fr-FR'] });
  expect(getClosestSupportedLanguageTag('fr-BE')).toBe('fr-FR');

  createLocalePrimitive({ supportedLanguageTags: ['fr-BE'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('fr-BE');

  createLocalePrimitive({ supportedLanguageTags: ['fr-BE', 'fr'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('fr');

  createLocalePrimitive({ supportedLanguageTags: ['nl', 'en'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('en');

  createLocalePrimitive({ supportedLanguageTags: ['nl', 'en-US'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('en-US');

  createLocalePrimitive({ supportedLanguageTags: ['nl', 'en-US', 'en'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('en');

  createLocalePrimitive({ supportedLanguageTags: ['nl', 'en-US', 'en-GB'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('en-US');

  createLocalePrimitive({ supportedLanguageTags: ['nl', 'en-GB'] });
  expect(getClosestSupportedLanguageTag('fr')).toBe('en-GB');
});
