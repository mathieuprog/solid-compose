import getTextDirection from './getTextDirection';
import TextDirection from './TextDirection';

test('getTextDirection', () => {
  expect(getTextDirection('en')).toEqual(TextDirection.LeftToRight);
  expect(getTextDirection('en-US')).toEqual(TextDirection.LeftToRight);
  expect(getTextDirection('ar-EG')).toEqual(TextDirection.RightToLeft);
});
