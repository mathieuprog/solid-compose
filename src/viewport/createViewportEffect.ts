import { createEffect, createRoot } from 'solid-js';
import useViewport from './useViewport';

export default function createViewportEffect() {
  const viewport = useViewport();

  createRoot(() => {
    createEffect(() => {
      viewport.width && document.documentElement.setAttribute('data-viewport-width-switchpoint', viewport.width);
      viewport.height && document.documentElement.setAttribute('data-viewport-height-switchpoint', viewport.height);
      viewport.orientation && document.documentElement.setAttribute('data-viewport-orientation', viewport.orientation);
    });
  });
};
