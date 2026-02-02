import React from 'react';
import { LUCKY_DRAW_2026_DESIGN_WIDTH, LUCKY_DRAW_2026_DESIGN_HEIGHT } from './lucky-draw-2026.constants';
import { ViewMode } from './types';

/** Track when background image is loaded */
export const useBackgroundLoaded = (src: string): boolean => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.onload = () => mounted && setIsLoaded(true);
    img.onerror = () => mounted && setIsLoaded(true);
    img.src = src;
    return () => {
      mounted = false;
    };
  }, [src]);

  return isLoaded;
};

/** Calculate responsive scale based on container size */
export const useResponsiveScale = (containerRef: React.RefObject<HTMLDivElement | null>): number => {
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      const nextScale = Math.min(rect.width / LUCKY_DRAW_2026_DESIGN_WIDTH, rect.height / LUCKY_DRAW_2026_DESIGN_HEIGHT);
      setScale(prev => {
        const safeNext = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
        return Math.abs(prev - safeNext) > 0.0001 ? safeNext : prev;
      });
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  return scale;
};

/** Determine current ViewMode */
export const getViewMode = (isAnnouncementVisible: boolean, displayMode: string): ViewMode => {
  if (isAnnouncementVisible) return 'winner';
  if (displayMode === 'ceremony') return 'ceremony';
  return 'draw';
};

/** Track view mode transitions */
export const useViewModeTransition = (currentViewMode: ViewMode) => {
  const prevViewModeRef = React.useRef<ViewMode>(currentViewMode);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const prevMode = prevViewModeRef.current;
    prevViewModeRef.current = currentViewMode;

    if (currentViewMode === 'winner' && prevMode !== 'winner') {
      setIsTransitioning(true);
    }
    if (currentViewMode !== 'winner' && prevMode === 'winner') {
      setIsTransitioning(false);
    }
  }, [currentViewMode]);

  return isTransitioning;
};
