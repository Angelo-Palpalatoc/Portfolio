import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import roomImage from '../MyRoom.png';
import PortfolioDesktop from './PortfolioDesktop';

export default function App() {
  const [view, setView] = useState<'room' | 'screen'>('room');
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const hoverArmed = useRef(true);
  const interacted = useRef(false);

  const measureZoom = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const screenWidth = stage.offsetWidth * 0.2105;
    const screenHeight = stage.offsetHeight * 0.0801;
    const maxWidth = window.innerWidth * (window.innerWidth < 600 ? 0.89 : 0.76);
    const maxHeight = window.innerHeight * (window.innerWidth < 600 ? 0.34 : 0.57);
    setZoom(Math.max(1, Math.min(maxWidth / screenWidth, maxHeight / screenHeight)));
  }, []);

  const enterScreen = useCallback(() => {
    if (view === 'screen') return;
    interacted.current = true;
    measureZoom();
    setView('screen');
    setStatus('Projects window open. Press Escape or use Back to room to return.');
  }, [measureZoom, view]);

  const leaveScreen = useCallback(() => {
    if (view === 'room') return;
    interacted.current = true;
    hoverArmed.current = false;
    setView('room');
    setStatus('Back in the room. Focus the main monitor and press Enter to explore.');
  }, [view]);

  useEffect(() => {
    measureZoom();
    window.addEventListener('resize', measureZoom);
    return () => window.removeEventListener('resize', measureZoom);
  }, [measureZoom]);

  useEffect(() => {
    if (!interacted.current) return;
    const frame = requestAnimationFrame(() => {
      if (view === 'screen') backRef.current?.focus({ preventScroll: true });
      else hotspotRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') leaveScreen();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [leaveScreen]);

  const onHotspotEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && hoverArmed.current) enterScreen();
  };

  return (
    <main className="experience" data-view={view} style={{ '--zoom': zoom } as CSSProperties}>
      <div className="room-stage" ref={stageRef}>
        <img className="room-image" src={roomImage} alt="A compact loft workspace with two monitors beneath a bed" draggable={false} />
        <div className="monitor-screen" id="monitorScreen">
          <div className="portfolio-mount" aria-hidden={view !== 'screen'} inert={view !== 'screen'}>
            <PortfolioDesktop />
          </div>
          {view === 'room' && (
            <button className="screen-hotspot" ref={hotspotRef} type="button" aria-label="Enter the main monitor to explore projects"
              onPointerEnter={onHotspotEnter} onPointerLeave={() => { hoverArmed.current = true; }} onClick={enterScreen}>
              <span className="hotspot-label">OPEN <span aria-hidden="true">↗</span></span>
            </button>
          )}
        </div>
      </div>
      <section className="room-caption" aria-hidden={view === 'screen'} inert={view === 'screen'} aria-label="Explore the main monitor">
        <span className="caption-kicker"><span className="caption-line" /> 01 / MAIN MONITOR</span>
        <span className="caption-title">Projects are on screen.</span>
        <span className="caption-hint">Hover over the monitor, or open it here.</span>
        <button className="caption-action" type="button" onClick={enterScreen}>Open projects <span aria-hidden="true">↗</span></button>
      </section>
      <button className="back-control" ref={backRef} type="button" onClick={leaveScreen} aria-hidden={view !== 'screen'} tabIndex={view === 'screen' ? 0 : -1}>
        <span aria-hidden="true">←</span> Back to room <kbd>ESC</kbd>
      </button>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </main>
  );
}
