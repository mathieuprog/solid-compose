import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import Orientation from './Orientation';
import { setPrimitive } from './globalPrimitive';
import type { ViewportPrimitive } from './globalPrimitive';

interface Config {
  heightSizeSwitchpoints?: {
    [key: string]: {
      minHeight?: number;
      maxHeight?: number;
    }
  };
  widthSizeSwitchpoints?: {
    [key: string]: {
      minWidth?: number;
      maxWidth?: number;
    }
  };
}

export default function createViewportPrimitive(config: Config) {
  let orientation, height, width;

  batch(() => {
    for (const [sizeName, range] of Object.entries(config.heightSizeSwitchpoints || {})) {
      const { minHeight, maxHeight } = range;

      let mediaQuery;
      if (minHeight && maxHeight) {
        mediaQuery = `(${minHeight}px <= height < ${maxHeight}px)`;
      } else if (minHeight) {
        mediaQuery = `(${minHeight}px <= height)`;
      } else if (maxHeight) {
        mediaQuery = `(height < ${maxHeight}px)`;
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
      const { minWidth, maxWidth } = range;

      let mediaQuery;
      if (minWidth && maxWidth) {
        mediaQuery = `(${minWidth}px <= width < ${maxWidth}px)`;
      } else if (minWidth) {
        mediaQuery = `(${minWidth}px <= width)`;
      } else if (maxWidth) {
        mediaQuery = `(width < ${maxWidth}px)`;
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
