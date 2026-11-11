import { useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { LoadNotice } from './LoadingState';
import type { LoadState } from './LoadingState';

// The exported document is self-contained. Its unpacker replaces the document
// before mounting the app, so the iframe load event alone isn't a ready signal.
export default function PortfolioFrame({
  frameRef,
  onNavigationKeyDown,
  onReady,
}: {
  frameRef: RefObject<HTMLIFrameElement | null>;
  onNavigationKeyDown: (event: KeyboardEvent) => void;
  onReady: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let active = true;
    let ready = false;
    let doc: Document | null = null;
    let contentObserver: MutationObserver | null = null;
    let documentObserver: MutationObserver | null = null;
    let scrollContainer: HTMLElement | null = null;
    let touchStart: {
      screenX: number;
      screenY: number;
      scrollTop: number;
      dragging: boolean;
      axis: 'x' | 'y' | null;
      lastTime: number;
      velocity: number;
    } | null = null;
    let glideFrame = 0;
    const controller = new AbortController();
    setState('loading');
    const timer = window.setTimeout(() => {
      if (active && !ready) setState('slow');
    }, 15000);
    const fail = () => {
      if (!active || ready) return;
      window.clearTimeout(timer);
      setState('error');
    };
    const stopGlide = () => {
      if (glideFrame) window.cancelAnimationFrame(glideFrame);
      glideFrame = 0;
    };
    const isScrollable = (element: HTMLElement) => {
      const style = doc?.defaultView?.getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return (
        !!style &&
        /auto|scroll/.test(style.overflowY) &&
        element.scrollHeight - element.clientHeight > 2 &&
        bounds.width > 0 &&
        bounds.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none'
      );
    };
    const findScrollContainer = (target: EventTarget | null) => {
      let element =
        target && typeof target === 'object' && 'nodeType' in target && target.nodeType === 1
          ? (target as HTMLElement)
          : null;
      while (element && element !== doc?.documentElement) {
        if (isScrollable(element)) return element;
        element = element.parentElement;
      }
      return (
        [...(doc?.querySelectorAll<HTMLElement>('*') ?? [])]
          .filter(isScrollable)
          .sort((left, right) => {
            const leftBounds = left.getBoundingClientRect();
            const rightBounds = right.getBoundingClientRect();
            const leftScore =
              (left.scrollHeight - left.clientHeight) * leftBounds.width * leftBounds.height;
            const rightScore =
              (right.scrollHeight - right.clientHeight) * rightBounds.width * rightBounds.height;
            return rightScore - leftScore;
          })[0] ?? null
      );
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !window.matchMedia('(orientation: portrait)').matches) return;
      stopGlide();
      scrollContainer = findScrollContainer(event.target);
      if (!scrollContainer) return;
      scrollContainer.style.setProperty('-webkit-overflow-scrolling', 'touch');
      scrollContainer.style.setProperty('overscroll-behavior', 'contain');
      touchStart = {
        screenX: touch.screenX,
        screenY: touch.screenY,
        scrollTop: scrollContainer.scrollTop,
        dragging: false,
        axis: null,
        lastTime: performance.now(),
        velocity: 0,
      };
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !touchStart || !scrollContainer) return;
      const deltaX = touch.screenX - touchStart.screenX;
      const deltaY = touch.screenY - touchStart.screenY;
      if (!touchStart.dragging && Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 6) return;
      touchStart.dragging = true;
      touchStart.axis ??= Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
      event.preventDefault();
      // In portrait, the app is rotated 90 degrees; map a horizontal finger
      // drag back onto the portfolio's normal vertical scroll axis. A vertical
      // drag remains supported for visitors who swipe against the rotation.
      const scrollDelta =
        window.matchMedia('(orientation: portrait)').matches && touchStart.axis === 'x'
          ? deltaX
          : -deltaY;
      const previousTop = scrollContainer.scrollTop;
      scrollContainer.scrollTop = touchStart.scrollTop + scrollDelta;
      const now = performance.now();
      const elapsed = Math.max(8, now - touchStart.lastTime);
      const instantaneousVelocity = (scrollContainer.scrollTop - previousTop) / elapsed;
      touchStart.velocity = touchStart.velocity * 0.45 + instantaneousVelocity * 0.55;
      touchStart.lastTime = now;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (
        event.type === 'touchend' &&
        touchStart?.dragging &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        scrollContainer
      ) {
        const startTop = scrollContainer.scrollTop;
        const glideDistance = Math.max(-180, Math.min(180, touchStart.velocity * 180));
        if (Math.abs(glideDistance) > 1) {
          let startedAt = 0;
          const glide = (now: number) => {
            if (!startedAt) startedAt = now;
            const progress = Math.min(1, (now - startedAt) / 220);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            scrollContainer!.scrollTop = startTop + glideDistance * easeOut;
            if (progress < 1) glideFrame = window.requestAnimationFrame(glide);
            else glideFrame = 0;
          };
          glideFrame = window.requestAnimationFrame(glide);
        }
      }
      touchStart = null;
    };
    const detachDocument = () => {
      doc?.removeEventListener('keydown', onNavigationKeyDown);
      doc?.removeEventListener('touchstart', onTouchStart);
      doc?.removeEventListener('touchmove', onTouchMove);
      doc?.removeEventListener('touchend', onTouchEnd);
      doc?.removeEventListener('touchcancel', onTouchEnd);
    };
    const bindDocument = () => {
      contentObserver?.disconnect();
      documentObserver?.disconnect();
      stopGlide();
      detachDocument();
      scrollContainer = null;
      doc = frame.contentDocument;
      if (!doc) return;
      const bindInteractions = () => {
        doc?.addEventListener('keydown', onNavigationKeyDown);
        doc?.addEventListener('touchstart', onTouchStart, { passive: true });
        doc?.addEventListener('touchmove', onTouchMove, { passive: false });
        doc?.addEventListener('touchend', onTouchEnd, { passive: true });
        doc?.addEventListener('touchcancel', onTouchEnd, { passive: true });
      };
      documentObserver = new MutationObserver(bindInteractions);
      documentObserver.observe(doc, { childList: true });
      bindInteractions();
      const checkReady = () => {
        if (!active || ready || !doc?.querySelector('#dc-root > *')) return;
        ready = true;
        window.clearTimeout(timer);
        contentObserver?.disconnect();
        setState('ready');
      };
      contentObserver = new MutationObserver(checkReady);
      contentObserver.observe(doc, { childList: true, subtree: true });
      checkReady();
    };
    frame.addEventListener('load', bindDocument);
    frame.addEventListener('error', fail);
    bindDocument();
    // Browsers can fire iframe load even for HTTP errors; check the response too.
    fetch(frame.src, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        if (!response.ok) fail();
      })
      .catch(() => {
        if (!controller.signal.aborted) fail();
      });
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
      frame.removeEventListener('load', bindDocument);
      frame.removeEventListener('error', fail);
      contentObserver?.disconnect();
      documentObserver?.disconnect();
      stopGlide();
      detachDocument();
      scrollContainer = null;
    };
  }, [attempt, frameRef, onNavigationKeyDown]);

  useLayoutEffect(() => {
    if (state === 'ready') onReady();
  }, [state, onReady]);

  return (
    <div className="portfolio-content" aria-busy={state === 'loading' || state === 'slow'}>
      <iframe
        key={attempt}
        ref={frameRef}
        className="arduino-frame"
        src={attempt ? `/arduino-portfolio.html?retry=${attempt}` : '/arduino-portfolio.html'}
        title="Angelo's portfolio in the Arduino IDE"
        aria-hidden={state !== 'ready'}
        inert={state !== 'ready'}
        style={{ visibility: state === 'ready' ? 'visible' : 'hidden' }}
      />
      <LoadNotice
        state={state}
        subject="Portfolio"
        onRetry={() => {
          setState('loading');
          setAttempt((value) => value + 1);
        }}
      />
    </div>
  );
}
