import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import Orientation from './Orientation';
import { setPrimitive } from './globalPrimitive';
import type { ViewportPrimitive } from './globalPrimitive';

interface Config {
  heightSizeSwitchpoints?: {
    [key: string]: {
      min?: number;
      max?: number;
    }
  };
  widthSizeSwitchpoints?: {
    [key: string]: {
      min?: number;
      max?: number;
    }
  };
}

export default function createViewportPrimitive(config: Config) {
  let orientation, height, width;

  batch(() => {
    for (const [sizeName, range] of Object.entries(config.heightSizeSwitchpoints || {})) {
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

      const mql = window.matchMedia(mediaQuery);

      if (mql.matches) {
        height = sizeName;
      }

      mql.addEventListener('change', (event) => {
        if (event.matches) {
          setViewport({ height: sizeName });
        }
      });
    }

    for (const [sizeName, range] of Object.entries(config.widthSizeSwitchpoints || {})) {
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

      const mql = window.matchMedia(mediaQuery);

      if (mql.matches) {
        width = sizeName;
      }

      mql.addEventListener('change', (event) => {
        if (event.matches) {
          setViewport({ width: sizeName });
        }
      });
    }

    const mqlLandscapeOrientation = window.matchMedia('(orientation: landscape)');

    if (mqlLandscapeOrientation.matches) {
      orientation = Orientation.Landscape;
    }

    mqlLandscapeOrientation.addEventListener('change', (event) => {
      if (event.matches) {
        setViewport({ orientation: Orientation.Landscape });
      }
    });

    const mqlPortraitOrientation = window.matchMedia('(orientation: portrait)');

    if (mqlPortraitOrientation.matches) {
      orientation = Orientation.Portrait;
    }

    mqlPortraitOrientation.addEventListener('change', (event) => {
      if (event.matches) {
        setViewport({ orientation: Orientation.Portrait });
      }
    });
  });

  const [viewport, setViewport] =
    createStore<ViewportPrimitive>({
      orientation,
      height,
      width
    });

  setPrimitive(viewport);
}
