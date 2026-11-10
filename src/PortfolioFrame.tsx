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
    let touchStart: { screenY: number; scrollTop: number; dragging: boolean } | null = null;
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
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !window.matchMedia('(orientation: portrait)').matches) return;
      touchStart = {
        screenY: touch.screenY,
        scrollTop: scrollContainer?.scrollTop ?? 0,
        dragging: false,
      };
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !touchStart || !scrollContainer) return;
      const deltaY = touch.screenY - touchStart.screenY;
      if (!touchStart.dragging && Math.abs(deltaY) < 6) return;
      touchStart.dragging = true;
      event.preventDefault();
      // In portrait, the app is rotated 90 degrees; map a vertical finger
      // drag back onto the portfolio's normal vertical scroll axis.
      scrollContainer.scrollTop = touchStart.scrollTop - deltaY;
    };
    const onTouchEnd = () => {
      touchStart = null;
    };
    const bindDocument = () => {
      contentObserver?.disconnect();
      documentObserver?.disconnect();
      scrollContainer?.removeEventListener('touchstart', onTouchStart);
      scrollContainer?.removeEventListener('touchmove', onTouchMove);
      doc?.removeEventListener('touchend', onTouchEnd);
      doc?.removeEventListener('touchcancel', onTouchEnd);
      scrollContainer = null;
      doc?.removeEventListener('keydown', onNavigationKeyDown);
      doc = frame.contentDocument;
      if (!doc) return;
      const bindPhoneScroll = () => {
        const candidate = [...(doc?.querySelectorAll<HTMLElement>('*') ?? [])].find((element) => {
          const style = doc?.defaultView?.getComputedStyle(element);
          return (
            !!style &&
            /auto|scroll/.test(style.overflowY) &&
            element.scrollHeight > element.clientHeight
          );
        });
        if (candidate === scrollContainer) return;
        scrollContainer?.removeEventListener('touchstart', onTouchStart);
        scrollContainer?.removeEventListener('touchmove', onTouchMove);
        scrollContainer = candidate ?? null;
        scrollContainer?.addEventListener('touchstart', onTouchStart, { passive: true });
        scrollContainer?.addEventListener('touchmove', onTouchMove, { passive: false });
      };
      const bindKeys = () => doc?.addEventListener('keydown', onNavigationKeyDown);
      documentObserver = new MutationObserver(bindKeys);
      documentObserver.observe(doc, { childList: true });
      bindKeys();
      bindPhoneScroll();
      doc.addEventListener('touchend', onTouchEnd, { passive: true });
      doc.addEventListener('touchcancel', onTouchEnd, { passive: true });
      const checkReady = () => {
        if (!active || ready || !doc?.querySelector('#dc-root > *')) return;
        bindPhoneScroll();
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
      scrollContainer?.removeEventListener('touchstart', onTouchStart);
      scrollContainer?.removeEventListener('touchmove', onTouchMove);
      doc?.removeEventListener('touchend', onTouchEnd);
      doc?.removeEventListener('touchcancel', onTouchEnd);
      scrollContainer = null;
      doc?.removeEventListener('keydown', onNavigationKeyDown);
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
