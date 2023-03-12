import isPartOfLanguageTag from './isPartOfLanguageTag';

test('isPartOfLanguageTag', () => {
  expect(isPartOfLanguageTag('en', 'en')).toBe(true);
  expect(isPartOfLanguageTag('en-US', 'en-US')).toBe(true);
  expect(isPartOfLanguageTag('en-US', 'en')).toBe(true);
  expect(isPartOfLanguageTag('en', 'en-US')).toBe(false);

  expect(isPartOfLanguageTag('en-Xxx-US', 'en-Xxx-US')).toBe(true);
  expect(isPartOfLanguageTag('en-Xxx-US', 'en-US')).toBe(true);
  expect(isPartOfLanguageTag('en-US', 'en-Xxx-US')).toBe(false);
  expect(isPartOfLanguageTag('en-Xxx-US', 'en-Yyy-US')).toBe(false);
  expect(isPartOfLanguageTag('en-Yyy-US', 'en-Xxx-US')).toBe(false);
  expect(isPartOfLanguageTag('en-Xxx-Yyy-US', 'en-Xxx-US')).toBe(true);
  expect(isPartOfLanguageTag('en-Xxx-Yyy-US', 'en-Yyy-US')).toBe(true);
  expect(isPartOfLanguageTag('en-Xxx-US', 'en-Xxx-Yyy-US')).toBe(false);
  expect(isPartOfLanguageTag('en-Yyy-US', 'en-Xxx-Yyy-US')).toBe(false);

  expect(isPartOfLanguageTag('en', 'fr')).toBe(false);
  expect(isPartOfLanguageTag('en-FR', 'fr-FR')).toBe(false);
  expect(isPartOfLanguageTag('en-US', 'en-UK')).toBe(false);
  expect(isPartOfLanguageTag('en-UK', 'en-US')).toBe(false);
});
