import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import Orientation from './Orientation';
import { setPrimitive } from './globalPrimitive';
import type { ViewportPrimitive } from './globalPrimitive';

interface Config {
  heightSwitchpoints?: {
    [key: string]: {
      min?: number;
      max?: number;
    }
  };
  widthSwitchpoints?: {
    [key: string]: {
      min?: number;
      max?: number;
    }
  };
}

export default function createViewportPrimitive(config: Config) {
  let orientation, height, width;

  batch(() => {
    for (const [sizeName, range] of Object.entries(config.heightSwitchpoints || {})) {
      const { min, max } = range;

      let mediaQuery;
      if (min && max) {
        mediaQuery = `(${min}px <= height < ${max}px)`;
      } else if (min) {
        mediaQuery = `(${min}px <= height)`;
      } else if (max) {
        mediaQuery = `(height < ${max}px)`;
      } else {
        throw new Error();
      }

      const mql = typeof window.matchMedia === 'function' && window.matchMedia(mediaQuery);

      if (mql) {
        if (mql.matches) {
          height = sizeName;
        }

        mql.addEventListener('change', (event) => {
          if (event.matches) {
            setViewport({ height: sizeName });
          }
        });
      }
    }

    for (const [sizeName, range] of Object.entries(config.widthSwitchpoints || {})) {
      const { min, max } = range;

      let mediaQuery;
      if (min && max) {
        mediaQuery = `(${min}px <= width < ${max}px)`;
      } else if (min) {
        mediaQuery = `(${min}px <= width)`;
      } else if (max) {
        mediaQuery = `(width < ${max}px)`;
      } else {
        throw new Error();
      }

      const mql = typeof window.matchMedia === 'function' && window.matchMedia(mediaQuery);

      if (mql) {
        if (mql.matches) {
          width = sizeName;
        }

        mql.addEventListener('change', (event) => {
          if (event.matches) {
            setViewport({ width: sizeName });
          }
        });
      }
    }

    const mqlLandscapeOrientation = typeof window.matchMedia === 'function' && window.matchMedia('(orientation: landscape)');

    if (mqlLandscapeOrientation) {
      if (mqlLandscapeOrientation.matches) {
        orientation = Orientation.Landscape;
      }

      mqlLandscapeOrientation.addEventListener('change', (event) => {
        if (event.matches) {
          setViewport({ orientation: Orientation.Landscape });
        }
      });
    }

    const mqlPortraitOrientation = typeof window.matchMedia === 'function' && window.matchMedia('(orientation: portrait)');

    if (mqlPortraitOrientation) {
      if (mqlPortraitOrientation.matches) {
        orientation = Orientation.Portrait;
      }

      mqlPortraitOrientation.addEventListener('change', (event) => {
        if (event.matches) {
          setViewport({ orientation: Orientation.Portrait });
        }
      });
    }
  });

  const [viewport, setViewport] =
    createStore<ViewportPrimitive>({
      orientation,
      height,
      width
    });

  setPrimitive(viewport);
}
