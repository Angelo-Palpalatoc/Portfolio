import { useEffect } from 'react';
import type { RefObject } from 'react';

// The room rotates the whole IDE into a phone's landscape reading position.
// A horizontal finger swipe then corresponds to the editor's vertical axis.
export function useRotatedTouchScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let touchStart: {
      x: number;
      y: number;
      top: number;
      axis: 'x' | 'y' | null;
      lastTime: number;
      velocity: number;
    } | null = null;
    let glideFrame = 0;

    const isRotatedReadingView = () =>
      window.matchMedia('(orientation: portrait)').matches &&
      !!element.closest('.experience[data-expanded="true"] .arduino-window');

    const stopGlide = () => {
      if (glideFrame) cancelAnimationFrame(glideFrame);
      glideFrame = 0;
    };

    const onStart = (event: TouchEvent) => {
      if (!isRotatedReadingView()) return;
      const touch = event.touches[0];
      if (!touch) return;
      stopGlide();
      touchStart = {
        x: touch.screenX,
        y: touch.screenY,
        top: element.scrollTop,
        axis: null,
        lastTime: performance.now(),
        velocity: 0,
      };
    };

    const onMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !touchStart || !isRotatedReadingView()) return;
      const dx = touch.screenX - touchStart.x;
      const dy = touch.screenY - touchStart.y;
      if (!touchStart.axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        touchStart.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      event.preventDefault();
      const previous = element.scrollTop;
      element.scrollTop = touchStart.top + (touchStart.axis === 'x' ? dx : -dy);
      const now = performance.now();
      const elapsed = Math.max(8, now - touchStart.lastTime);
      touchStart.velocity =
        touchStart.velocity * 0.45 + ((element.scrollTop - previous) / elapsed) * 0.55;
      touchStart.lastTime = now;
    };

    const onEnd = () => {
      if (touchStart?.axis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const startTop = element.scrollTop;
        const distance = Math.max(-180, Math.min(180, touchStart.velocity * 180));
        if (Math.abs(distance) > 1) {
          let startedAt = 0;
          const glide = (now: number) => {
            if (!startedAt) startedAt = now;
            const progress = Math.min(1, (now - startedAt) / 220);
            element.scrollTop = startTop + distance * (1 - (1 - progress) ** 3);
            glideFrame = progress < 1 ? requestAnimationFrame(glide) : 0;
          };
          glideFrame = requestAnimationFrame(glide);
        }
      }
      touchStart = null;
    };

    element.addEventListener('touchstart', onStart, { passive: true });
    element.addEventListener('touchmove', onMove, { passive: false });
    element.addEventListener('touchend', onEnd, { passive: true });
    element.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      stopGlide();
      element.removeEventListener('touchstart', onStart);
      element.removeEventListener('touchmove', onMove);
      element.removeEventListener('touchend', onEnd);
      element.removeEventListener('touchcancel', onEnd);
    };
  }, [ref]);
}
