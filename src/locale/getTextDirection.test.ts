import getTextDirection from './getTextDirection';

test('getTextDirection', () => {
  expect(getTextDirection('en')).toBe('ltr');
  expect(getTextDirection('en-US')).toBe('ltr');
  expect(getTextDirection('ar-EG')).toBe('rtl');
});
