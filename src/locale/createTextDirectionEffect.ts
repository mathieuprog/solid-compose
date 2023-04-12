import { createEffect, createRoot } from 'solid-js';
import { useLocale } from '..';
import TextDirection from './TextDirection';

export default function createTextDirectionEffect() {
  const [locale] = useLocale();

  createRoot(() => {
    createEffect(() => {
      switch (locale.textDirection) {
        case TextDirection.LeftToRight:
          document.documentElement.dir = 'ltr';
          break;

        case TextDirection.RightToLeft:
          document.documentElement.dir = 'rtl';
          break;
      }
    });
  });
};
