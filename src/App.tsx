import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { lazy, Suspense } from 'react';
import roomImage from './assets/room.webp';
import monitorBackground from './assets/desktop-background.webp';
import { monitorProjection } from './monitorProjection';
import { LoadNotice, useImageAsset } from './LoadingState';
import AutoRenameDemo from './AutoRenameDemo';
import PortraitCvViewer from './PortraitCvViewer';
import { playSound, setSoundEnabled, unlockSound, useSoundEnabled } from './sound';
const ArduinoPortfolio = lazy(() => import('./portfolio/ArduinoPortfolio'));

const ideWidth = 1280;
const portraitLogicalWidth = 440;
const cvUrl = '/Angelo-Palpalatoc-CV.pdf';
const deskParallaxIntensity = 1.3;
const deskBounds = { left: 0.28, top: 0.355, width: 0.59, height: 0.28 };
const deskCenter = { x: 0.575, y: 0.495 };
const screenCenter = { x: 0.5635, y: 0.5109 };
const stageOrigin = { x: 0.56375, y: 0.50965 };
const portraitCenter = { x: 0.4099, y: 0.5171 };
const mobileRoomParallaxScale = 0.8;
const mobileRoomTiltRange = 18;
const mobileDeskParallaxScale = 0.65;
const phoneQuery =
  '(max-width: 700px), (max-width: 950px) and (pointer: coarse), (max-width: 950px) and (max-height: 500px)';
type View = 'room' | 'desk' | 'screen' | 'portrait';
type AppName = 'arduino' | 'autorename';
type AppWindow = AppName | null;
type CameraPose = { x: number; y: number; scale: number };
type MotionStatus =
  'hidden' | 'prompt' | 'requesting' | 'calibrating' | 'active' | 'denied' | 'unavailable' | 'off';
type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};
const initialPose = { x: 0, y: 0, scale: 1 };
const interactiveSelector =
  'button:not(:disabled), a[href], input, [role="tab"], [role="menuitem"]';
const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest(interactiveSelector)) &&
  !target.closest('.sound-toggle');
const outside = (x: number, y: number, rect: DOMRect, margin = 0) =>
  x < rect.left - margin ||
  x > rect.right + margin ||
  y < rect.top - margin ||
  y > rect.bottom + margin;
const shortestAngleDelta = (value: number, baseline: number) =>
  ((((value - baseline + 180) % 360) + 360) % 360) - 180;
const normalizeTilt = (value: number) => {
  const deadZone = 2;
  const magnitude = Math.abs(value);
  if (magnitude <= deadZone) return 0;
  return Math.sign(value) * Math.min(1, (magnitude - deadZone) / (mobileRoomTiltRange - deadZone));
};
const screenRelativeTilt = (beta: number, gamma: number) => {
  const angle = Math.round((window.screen.orientation?.angle ?? 0) / 90) * 90;
  if (angle === 90) return { x: beta, y: -gamma };
  if (angle === 180 || angle === -180) return { x: -gamma, y: -beta };
  if (angle === 270 || angle === -90) return { x: -beta, y: gamma };
  return { x: gamma, y: beta };
};

export default function App() {
  const [view, setView] = useState<View>('room');
  const [activeApp, setActiveApp] = useState<AppWindow>('arduino');
  const [openApps, setOpenApps] = useState<Record<AppName, boolean>>({
    arduino: true,
    autorename: false,
  });
  const [windowMaximized, setWindowMaximized] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [motionStatus, setMotionStatus] = useState<MotionStatus>('hidden');
  const soundEnabled = useSoundEnabled();
  const roomAsset = useImageAsset(roomImage);
  const wallpaperAsset = useImageAsset(monitorBackground, roomAsset.state === 'ready');
  const [status, setStatus] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLButtonElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const portraitMonitorRef = useRef<HTMLButtonElement>(null);
  const portraitWindowRef = useRef<HTMLElement>(null);
  const desktopAppRef = useRef<HTMLButtonElement>(null);
  const autoRenameRef = useRef<HTMLButtonElement>(null);
  const autoRenameWindowRef = useRef<HTMLElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const mobileBackRef = useRef<HTMLButtonElement>(null);
  const reactPortfolioRef = useRef<HTMLDivElement>(null);
  const mobileExpandedRef = useRef(mobileExpanded);
  mobileExpandedRef.current = mobileExpanded;
  const hoverArmed = useRef(true);
  const portraitHoverArmed = useRef(true);
  const lastZoomedView = useRef<'screen' | 'portrait' | null>(null);
  const interacted = useRef(false);
  const viewRef = useRef<View>('room');
  const poses = useRef<Record<View, CameraPose>>({
    room: initialPose,
    desk: initialPose,
    screen: initialPose,
    portrait: initialPose,
  });
  const camera = useRef({
    current: { ...initialPose },
    target: { ...initialPose },
    velocity: { ...initialPose, scale: 0 },
    frame: 0,
    lastTime: 0,
    frequency: 8,
    destination: 'room' as View,
    initialized: false,
    ready: true,
  });
  const roomOffset = useRef({ x: 0, y: 0 });
  const orientationBaseline = useRef<{ beta: number; gamma: number } | null>(null);
  const orientationSamples = useRef(0);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portraitEnterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressedInteractive = useRef(false);
  const deskMotion = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, blend: 0, velocity: 0 });
  const checkHoverRef = useRef<() => void>(() => {});

  // Camera motion and scene measurement.
  const paintDesk = useCallback(() => {
    const motion = deskMotion.current;
    const intensity = motion.blend * deskParallaxIntensity;
    // Drop the extra 3D layer once tilt has settled to keep the screen sharp.
    stageRef.current?.toggleAttribute('data-desk-motion', motion.blend !== 0);
    const style = stageRef.current?.style;
    style?.setProperty('--desk-pan-x', `${-motion.x * 22 * intensity}px`);
    style?.setProperty('--desk-pan-y', `${-motion.y * 13 * intensity}px`);
    style?.setProperty('--desk-tilt-x', `${-motion.y * 2.4 * intensity}deg`);
    style?.setProperty('--desk-tilt-y', `${motion.x * 3.2 * intensity}deg`);
  }, []);

  const paintCamera = useCallback((pose: CameraPose) => {
    const style = stageRef.current?.style;
    style?.setProperty('--camera-x', `${pose.x}px`);
    style?.setProperty('--camera-y', `${pose.y}px`);
    style?.setProperty('--camera-scale', String(pose.scale));
  }, []);

  const tickCamera = useCallback(
    function tick(now: number) {
      const motion = camera.current;
      const wasReady = motion.ready;
      const elapsed = motion.lastTime ? Math.min((now - motion.lastTime) / 1000, 0.05) : 1 / 60;
      motion.lastTime = now;
      const omega = motion.frequency;
      const decay = Math.exp(-omega * elapsed);
      for (const key of ['x', 'y', 'scale'] as const) {
        const displacement = motion.current[key] - motion.target[key];
        const step = (motion.velocity[key] + omega * displacement) * elapsed;
        motion.current[key] = motion.target[key] + (displacement + step) * decay;
        motion.velocity[key] = (motion.velocity[key] - omega * step) * decay;
      }
      paintCamera(motion.current);
      const cameraClose =
        Math.abs(motion.current.x - motion.target.x) < 0.5 &&
        Math.abs(motion.current.y - motion.target.y) < 0.5 &&
        Math.abs(motion.current.scale - motion.target.scale) < 0.002 &&
        Math.abs(motion.velocity.x) < 2 &&
        Math.abs(motion.velocity.y) < 2;
      if (cameraClose) {
        motion.current = { ...motion.target };
        motion.velocity = { x: 0, y: 0, scale: 0 };
        paintCamera(motion.current);
      }

      // Parallax uses elapsed time; its influence follows the same spring as zoom.
      const desk = deskMotion.current;
      const atDesk = motion.destination === 'desk';
      const blendTarget = atDesk ? 1 : 0;
      const displacement = desk.blend - blendTarget;
      const step = (desk.velocity + omega * displacement) * elapsed;
      desk.blend = blendTarget + (displacement + step) * decay;
      desk.velocity = (desk.velocity - omega * step) * decay;
      const blendClose =
        Math.abs(desk.blend - blendTarget) < 0.001 && Math.abs(desk.velocity) < 0.01;
      if (blendClose) {
        desk.blend = blendTarget;
        desk.velocity = 0;
      }
      const targetX = atDesk ? desk.targetX : 0;
      const targetY = atDesk ? desk.targetY : 0;
      const follow = 1 - Math.exp(-5 * elapsed);
      desk.x += (targetX - desk.x) * follow;
      desk.y += (targetY - desk.y) * follow;
      const parallaxClose =
        Math.abs(desk.x - targetX) < 0.0005 && Math.abs(desk.y - targetY) < 0.0005;
      if (parallaxClose) {
        desk.x = targetX;
        desk.y = targetY;
      }
      paintDesk();
      motion.ready = cameraClose && blendClose;
      if (motion.ready && parallaxClose) {
        motion.frame = 0;
        motion.lastTime = 0;
      } else {
        motion.frame = requestAnimationFrame(tick);
      }
      // A moving hotspot may arrive beneath a stationary mouse. Recheck on arrival.
      if (motion.ready && !wasReady && motion.destination !== 'room') checkHoverRef.current();
    },
    [paintCamera, paintDesk],
  );

  const wakeCamera = useCallback(() => {
    const motion = camera.current;
    if (!motion.frame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      motion.lastTime = 0;
      motion.frame = requestAnimationFrame(tickCamera);
    }
  }, [tickCamera]);

  const aimCamera = useCallback(
    (pose: CameraPose, destination: View) => {
      const motion = camera.current;
      if (motion.destination !== destination) {
        motion.velocity = { x: 0, y: 0, scale: 0 };
        motion.destination = destination;
      }
      motion.target = { ...pose };
      motion.frequency = destination === 'screen' || destination === 'portrait' ? 6 : 8;
      motion.ready = false;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (motion.frame) cancelAnimationFrame(motion.frame);
        motion.current = { ...pose };
        motion.velocity = { x: 0, y: 0, scale: 0 };
        motion.frame = 0;
        motion.lastTime = 0;
        motion.ready = true;
        const desk = deskMotion.current;
        desk.x = desk.y = desk.blend = desk.velocity = 0;
        paintDesk();
        paintCamera(pose);
      } else wakeCamera();
    },
    [paintCamera, paintDesk, wakeCamera],
  );

  const updateRoomPose = useCallback(
    (x: number, y: number) => {
      const stage = stageRef.current;
      if (!stage || viewRef.current !== 'room') return;
      roomOffset.current.x = x;
      roomOffset.current.y = y;
      poses.current.room = {
        x: -stage.offsetWidth / 2 + x,
        y: -stage.offsetHeight / 2 + y,
        scale: 1,
      };
      aimCamera(poses.current.room, 'room');
    },
    [aimCamera],
  );

  const measureScene = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const width = stage.offsetWidth;
    const height = stage.offsetHeight;
    const screenWidth = width * 0.213;
    const screenHeight = height * 0.0868;
    const portraitWidth = width * 0.0834;
    const portraitHeight = height * 0.1142;
    const screen = stage.querySelector<HTMLElement>('.monitor-screen');
    if (screen && !mobileExpandedRef.current) {
      const style = getComputedStyle(screen);
      const physicalWidth = parseFloat(style.width);
      const physicalHeight = parseFloat(style.height);
      screen.style.setProperty('--desktop-width', `${ideWidth}px`);
      screen.style.setProperty(
        '--desktop-height',
        `${(ideWidth * physicalHeight) / physicalWidth}px`,
      );
      screen.style.setProperty(
        '--monitor-projection',
        monitorProjection(physicalWidth, physicalHeight, style.clipPath, ideWidth),
      );
    }
    const portrait = stage.querySelector<HTMLElement>('.portrait-monitor');
    if (portrait && !mobileExpandedRef.current) {
      const style = getComputedStyle(portrait);
      const physicalWidth = parseFloat(style.width);
      const physicalHeight = parseFloat(style.height);
      portrait.style.setProperty('--portrait-width', `${portraitLogicalWidth}px`);
      portrait.style.setProperty(
        '--portrait-height',
        `${(portraitLogicalWidth * physicalHeight) / physicalWidth}px`,
      );
      portrait.style.setProperty(
        '--portrait-projection',
        monitorProjection(physicalWidth, physicalHeight, style.clipPath, portraitLogicalWidth),
      );
    }
    const screenZoom = Math.max(
      1,
      Math.min(
        (window.innerWidth * 0.866) / screenWidth,
        (window.innerHeight * 0.9) / screenHeight,
      ),
    );
    const portraitZoom = Math.max(
      1,
      Math.min(
        (window.innerWidth * 0.88) / portraitWidth,
        (window.innerHeight * 0.94) / portraitHeight,
      ),
    );
    const deskZoom = Math.max(
      1,
      Math.min(
        (window.innerWidth * 0.84) / (width * deskBounds.width),
        (window.innerHeight * 0.86) / (height * deskBounds.height),
      ),
    );
    poses.current = {
      room: {
        x: -width / 2 + roomOffset.current.x,
        y: -height / 2 + roomOffset.current.y,
        scale: 1,
      },
      desk: {
        x: (-deskCenter.x - (deskZoom - 1) * (deskCenter.x - screenCenter.x)) * width,
        y: (-deskCenter.y - (deskZoom - 1) * (deskCenter.y - screenCenter.y)) * height,
        scale: deskZoom,
      },
      screen: {
        x: -screenCenter.x * width,
        y: -screenCenter.y * height + window.innerHeight * 0.005,
        scale: screenZoom,
      },
      portrait: {
        x: (-portraitCenter.x - (portraitZoom - 1) * (portraitCenter.x - stageOrigin.x)) * width,
        y: (-portraitCenter.y - (portraitZoom - 1) * (portraitCenter.y - stageOrigin.y)) * height,
        scale: portraitZoom,
      },
    };
    if (!camera.current.initialized) {
      camera.current.current = { ...poses.current.room };
      camera.current.target = { ...poses.current.room };
      camera.current.initialized = true;
      paintCamera(camera.current.current);
    } else {
      aimCamera(poses.current[viewRef.current], viewRef.current);
    }
  }, [aimCamera, paintCamera]);

  // View and desktop-window actions.
  const clearExitTimer = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = null;
  }, []);

  const clearPortraitEnterTimer = useCallback(() => {
    if (portraitEnterTimer.current) clearTimeout(portraitEnterTimer.current);
    portraitEnterTimer.current = null;
  }, []);

  const toggleSound = () => {
    unlockSound();
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('click');
    setStatus(next ? 'Sound effects enabled.' : 'Sound effects muted.');
  };

  const enterDesk = () => {
    if (viewRef.current !== 'room') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    orientationBaseline.current = null;
    setStartMenuOpen(false);
    measureScene();
    viewRef.current = 'desk';
    aimCamera(poses.current.desk, 'desk');
    setView('desk');
    playSound('zoomIn');
    setStatus('At the desk. Hover or select either monitor to open the portfolio or read the CV.');
  };

  const enterScreen = () => {
    if (viewRef.current !== 'desk') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    measureScene();
    viewRef.current = 'screen';
    aimCamera(poses.current.screen, 'screen');
    setView('screen');
    playSound('zoomIn');
    const mobile = window.matchMedia(phoneQuery).matches;
    setMobileExpanded(mobile);
    setStatus(
      mobile
        ? `${activeApp === 'autorename' ? 'Sec Renamer' : 'Arduino IDE'} open in phone reading view.`
        : `${activeApp === 'arduino' ? 'Arduino IDE' : activeApp === 'autorename' ? 'Sec Renamer' : 'Desktop'} open inside the monitor. Press Escape or move away to return to the desk.`,
    );
  };

  const enterPortrait = () => {
    if (viewRef.current !== 'desk') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    setStartMenuOpen(false);
    measureScene();
    viewRef.current = 'portrait';
    aimCamera(poses.current.portrait, 'portrait');
    setView('portrait');
    playSound('zoomIn');
    const mobile = window.matchMedia(phoneQuery).matches;
    setMobileExpanded(mobile);
    setStatus(
      mobile
        ? 'CV open in phone reading view.'
        : 'CV open inside the portrait monitor. Scroll to read, or press Escape or move away to return to the desk.',
    );
  };

  const closeApp = (app: AppName) => {
    const name = app === 'autorename' ? 'Sec Renamer' : 'Arduino IDE';
    playSound('windowClose');
    setOpenApps((current) => ({ ...current, [app]: false }));
    setActiveApp(null);
    setWindowMaximized(false);
    setStartMenuOpen(false);
    setMobileExpanded(false);
    setStatus(`${name} closed. Choose a desktop icon to open an app.`);
  };

  const minimizeApp = () => {
    if (!activeApp) return;
    const name = activeApp === 'autorename' ? 'Sec Renamer' : 'Arduino IDE';
    playSound('windowClose');
    setActiveApp(null);
    setStartMenuOpen(false);
    setStatus(`${name} minimized to the taskbar. Its current state is preserved.`);
  };

  const openApp = useCallback((app: AppName = 'arduino') => {
    playSound('windowOpen');
    setOpenApps((current) => ({ ...current, [app]: true }));
    setActiveApp(app);
    setWindowMaximized(false);
    setStartMenuOpen(false);
    setStatus(`${app === 'autorename' ? 'Sec Renamer' : 'Arduino IDE'} opened.`);
  }, []);

  const activateTaskbarApp = (app: AppName) => {
    if (activeApp === app) minimizeApp();
    else openApp(app);
  };

  const toggleMaximize = () => {
    setWindowMaximized((value) => !value);
  };

  const leaveScreen = useCallback(() => {
    if (viewRef.current !== 'screen') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    setStartMenuOpen(false);
    orientationBaseline.current = null;
    orientationSamples.current = 0;
    hoverArmed.current = false;
    portraitHoverArmed.current = false;
    lastZoomedView.current = 'screen';
    setMobileExpanded(false);
    viewRef.current = 'desk';
    aimCamera(poses.current.desk, 'desk');
    setView('desk');
    playSound('zoomOut');
    setStatus('Back at the desk. Move away to see the room.');
  }, [aimCamera, clearExitTimer, clearPortraitEnterTimer]);

  const leavePortrait = useCallback(() => {
    if (viewRef.current !== 'portrait') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    orientationBaseline.current = null;
    orientationSamples.current = 0;
    hoverArmed.current = false;
    portraitHoverArmed.current = false;
    lastZoomedView.current = 'portrait';
    setMobileExpanded(false);
    viewRef.current = 'desk';
    aimCamera(poses.current.desk, 'desk');
    setView('desk');
    playSound('zoomOut');
    setStatus('Back at the desk. Move away to see the room.');
  }, [aimCamera, clearExitTimer, clearPortraitEnterTimer]);

  const handlePhoneBack = () => {
    if (viewRef.current === 'portrait') {
      leavePortrait();
      return;
    }
    if (activeApp === 'autorename') {
      openApp('arduino');
      return;
    }
    leaveScreen();
  };

  const leaveDesk = useCallback(() => {
    if (viewRef.current !== 'desk') return;
    interacted.current = true;
    clearExitTimer();
    clearPortraitEnterTimer();
    orientationBaseline.current = null;
    setStartMenuOpen(false);
    viewRef.current = 'room';
    aimCamera(poses.current.room, 'room');
    setView('room');
    playSound('zoomOut');
    setStatus('Back in the room. Explore the computer setup to approach the desk.');
  }, [aimCamera, clearExitTimer, clearPortraitEnterTimer]);

  const onNavigationKeyDown = useCallback(
    (event: KeyboardEvent) => {
      unlockSound();
      if (!event.repeat && ['Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        playSound('key');
      }
      // Keyboard navigation remains stable until the mouse is deliberately moved.
      pointer.current.active = false;
      clearExitTimer();
      if (event.key === 'Meta' || event.key === 'OS') {
        if (viewRef.current === 'screen' && !mobileExpandedRef.current) {
          event.preventDefault();
          setStartMenuOpen((value) => !value);
        }
        return;
      }
      if (event.altKey && event.key === 'Tab') {
        if (viewRef.current === 'screen' && !mobileExpandedRef.current) {
          event.preventDefault();
          openApp(activeApp === 'arduino' ? 'autorename' : 'arduino');
        }
        return;
      }
      if (startMenuOpen && event.key === 'Escape') {
        event.preventDefault();
        setStartMenuOpen(false);
        startButtonRef.current?.focus({ preventScroll: true });
        return;
      }
      if (startMenuOpen && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        const items = Array.from(
          startMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
        );
        if (!items.length) return;
        event.preventDefault();
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : event.key === 'ArrowDown'
                ? (current + 1 + items.length) % items.length
                : (current - 1 + items.length) % items.length;
        items[next]?.focus({ preventScroll: true });
        return;
      }
      if (event.key !== 'Escape') return;
      if (viewRef.current === 'portrait') {
        event.preventDefault();
        leavePortrait();
        return;
      }
      if (viewRef.current === 'screen' && mobileExpandedRef.current) {
        if (activeApp === 'autorename') openApp('arduino');
        else leaveScreen();
      } else if (viewRef.current === 'screen') leaveScreen();
      else if (viewRef.current === 'desk') leaveDesk();
    },
    [activeApp, openApp, leaveScreen, leavePortrait, leaveDesk, clearExitTimer, startMenuOpen],
  );

  // Responsive measurements, keyboard navigation, and focus management.
  useLayoutEffect(() => {
    // The same React app expands; changing viewport size must also restore the
    // physical projection when leaving the phone reading layout.
    measureScene();
    const phone = window.matchMedia(phoneQuery);
    const restoreMonitor = () => {
      if (!phone.matches) setMobileExpanded(false);
    };
    phone.addEventListener('change', restoreMonitor);
    window.addEventListener('resize', restoreMonitor);
    return () => {
      phone.removeEventListener('change', restoreMonitor);
      window.removeEventListener('resize', restoreMonitor);
    };
  }, [mobileExpanded, measureScene]);

  useLayoutEffect(() => {
    measureScene();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.addEventListener('change', measureScene);
    window.addEventListener('resize', measureScene);
    return () => {
      reducedMotion.removeEventListener('change', measureScene);
      window.removeEventListener('resize', measureScene);
      clearExitTimer();
      clearPortraitEnterTimer();
      if (camera.current.frame) cancelAnimationFrame(camera.current.frame);
      camera.current.frame = 0;
      camera.current.lastTime = 0;
    };
  }, [measureScene, clearExitTimer, clearPortraitEnterTimer]);

  useLayoutEffect(() => {
    if (!interacted.current) return;
    if ((view === 'screen' || view === 'portrait') && window.matchMedia(phoneQuery).matches)
      mobileBackRef.current?.focus({ preventScroll: true });
    else if (view === 'portrait') portraitWindowRef.current?.focus({ preventScroll: true });
    else if (view === 'screen' && activeApp === 'arduino')
      reactPortfolioRef.current?.focus({ preventScroll: true });
    else if (view === 'screen' && activeApp === 'autorename')
      autoRenameWindowRef.current?.focus({ preventScroll: true });
    else if (view === 'screen') desktopAppRef.current?.focus({ preventScroll: true });
    else if (view === 'desk') {
      if (lastZoomedView.current === 'portrait')
        portraitMonitorRef.current?.focus({ preventScroll: true });
      else hotspotRef.current?.focus({ preventScroll: true });
      lastZoomedView.current = null;
    } else deskRef.current?.focus({ preventScroll: true });
  }, [view, activeApp, mobileExpanded]);

  useLayoutEffect(() => {
    if (startMenuOpen)
      startMenuRef.current
        ?.querySelector<HTMLButtonElement>('[role="menuitem"]')
        ?.focus({ preventScroll: true });
  }, [startMenuOpen]);

  useLayoutEffect(() => {
    window.addEventListener('keydown', onNavigationKeyDown);
    return () => window.removeEventListener('keydown', onNavigationKeyDown);
  }, [onNavigationKeyDown]);

  const onPortfolioReady = useCallback(() => {
    if (
      interacted.current &&
      viewRef.current === 'screen' &&
      !mobileExpandedRef.current &&
      !window.matchMedia(phoneQuery).matches
    )
      reactPortfolioRef.current?.focus({ preventScroll: true });
  }, []);

  const resetMotionPose = useCallback(() => {
    orientationBaseline.current = null;
    orientationSamples.current = 0;
    deskMotion.current.targetX = 0;
    deskMotion.current.targetY = 0;
    if (viewRef.current === 'room') updateRoomPose(0, 0);
    else if (viewRef.current === 'desk') wakeCamera();
  }, [updateRoomPose, wakeCamera]);

  const disableMotion = useCallback(() => {
    resetMotionPose();
    setMotionStatus('off');
    setStatus('Motion view turned off. Touch movement remains available.');
  }, [resetMotionPose]);

  const recenterMotion = useCallback(() => {
    resetMotionPose();
    setMotionStatus('calibrating');
    setStatus('Motion view is recalibrating. Hold your phone comfortably.');
  }, [resetMotionPose]);

  const requestMotionPermission = useCallback(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotionStatus('off');
      setStatus('Motion view is off because reduced motion is enabled.');
      return;
    }
    if (!window.isSecureContext || !('DeviceOrientationEvent' in window)) {
      setMotionStatus('unavailable');
      setStatus('Motion sensors are unavailable here. Touch movement remains available.');
      return;
    }
    setMotionStatus('requesting');
    try {
      const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor;
      const result = OrientationEvent.requestPermission
        ? await OrientationEvent.requestPermission()
        : 'granted';
      if (result !== 'granted') {
        setMotionStatus('denied');
        setStatus('Motion permission was not granted. Touch movement remains available.');
        return;
      }
      orientationBaseline.current = null;
      orientationSamples.current = 0;
      setMotionStatus('calibrating');
      setStatus('Motion permission granted. Hold your phone comfortably while it calibrates.');
    } catch {
      setMotionStatus('denied');
      setStatus('Motion permission could not be enabled. Touch movement remains available.');
    }
  }, []);

  useLayoutEffect(() => {
    const phone = window.matchMedia(phoneQuery);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPrompt = () => {
      if (!phone.matches) {
        if (motionStatus !== 'hidden') setMotionStatus('hidden');
        resetMotionPose();
      } else if (reducedMotion.matches) {
        if (motionStatus !== 'off') setMotionStatus('off');
        resetMotionPose();
      } else if (motionStatus === 'hidden') {
        if (!window.isSecureContext || !('DeviceOrientationEvent' in window)) {
          setMotionStatus('unavailable');
          setStatus('Motion sensors are unavailable here. Touch movement remains available.');
          return;
        }
        const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor;
        if (typeof OrientationEvent.requestPermission === 'function') {
          setMotionStatus('prompt');
          return;
        }
        orientationBaseline.current = null;
        orientationSamples.current = 0;
        setMotionStatus('calibrating');
        setStatus('Motion view is starting automatically. Hold your phone comfortably.');
      }
    };
    syncMotionPrompt();
    phone.addEventListener('change', syncMotionPrompt);
    reducedMotion.addEventListener('change', syncMotionPrompt);
    return () => {
      phone.removeEventListener('change', syncMotionPrompt);
      reducedMotion.removeEventListener('change', syncMotionPrompt);
    };
  }, [motionStatus, resetMotionPose]);

  useLayoutEffect(() => {
    if (motionStatus !== 'calibrating' && motionStatus !== 'active') return;
    const calibrationTimer =
      motionStatus === 'calibrating'
        ? window.setTimeout(() => {
            setMotionStatus('unavailable');
            resetMotionPose();
            setStatus('No motion readings were received. Touch movement remains available.');
          }, 3000)
        : 0;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (document.visibilityState !== 'visible') return;
      if (
        viewRef.current === 'screen' ||
        viewRef.current === 'portrait' ||
        mobileExpandedRef.current
      )
        return;
      if (event.beta == null || event.gamma == null) return;
      if (!orientationBaseline.current) {
        orientationBaseline.current = { beta: event.beta, gamma: event.gamma };
        orientationSamples.current = 1;
        return;
      }
      orientationSamples.current += 1;
      if (motionStatus === 'calibrating' && orientationSamples.current >= 2) {
        setMotionStatus('active');
        setStatus('Motion view enabled. Tilt your phone gently to look around.');
      }
      const rawTilt = screenRelativeTilt(
        shortestAngleDelta(event.beta, orientationBaseline.current.beta),
        shortestAngleDelta(event.gamma, orientationBaseline.current.gamma),
      );
      const normalizedX = normalizeTilt(rawTilt.x);
      const normalizedY = normalizeTilt(rawTilt.y);
      if (viewRef.current === 'room') {
        updateRoomPose(
          -normalizedX * 36 * mobileRoomParallaxScale,
          -normalizedY * 24 * mobileRoomParallaxScale,
        );
      } else if (viewRef.current === 'desk') {
        deskMotion.current.targetX = normalizedX * mobileDeskParallaxScale;
        deskMotion.current.targetY = normalizedY * mobileDeskParallaxScale;
        wakeCamera();
      }
    };
    const resetBaseline = () => {
      orientationBaseline.current = null;
      orientationSamples.current = 0;
    };
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    window.screen.orientation?.addEventListener('change', resetBaseline);
    document.addEventListener('visibilitychange', resetBaseline);
    return () => {
      if (calibrationTimer) window.clearTimeout(calibrationTimer);
      window.removeEventListener('deviceorientation', onOrientation);
      window.screen.orientation?.removeEventListener('change', resetBaseline);
      document.removeEventListener('visibilitychange', resetBaseline);
    };
  }, [motionStatus, resetMotionPose, updateRoomPose, wakeCamera]);

  // Pointer navigation between the room, desk, and both monitors. Short grace
  // periods prevent irregular projected edges from feeling like traps, and a
  // brief hover dwell on the portrait monitor avoids accidental zooms while
  // sweeping toward the main screen.
  const monitorExitDelay = 280;
  const deskExitDelay = 180;
  const portraitHoverDelay = 220;
  const scheduleExit = (from: 'desk' | 'screen' | 'portrait') => {
    if (exitTimer.current) return;
    exitTimer.current = setTimeout(
      () => {
        exitTimer.current = null;
        if (
          viewRef.current !== from ||
          !camera.current.ready ||
          !pointer.current.active ||
          mobileExpandedRef.current
        )
          return;
        const bounds =
          from === 'screen'
            ? stageRef.current?.querySelector('.monitor-screen')?.getBoundingClientRect()
            : from === 'portrait'
              ? stageRef.current?.querySelector('.portrait-monitor')?.getBoundingClientRect()
              : deskRef.current?.getBoundingClientRect();
        if (bounds && outside(pointer.current.x, pointer.current.y, bounds, 10)) {
          if (from === 'screen') leaveScreen();
          else if (from === 'portrait') leavePortrait();
          else leaveDesk();
        }
      },
      from === 'desk' ? deskExitDelay : monitorExitDelay,
    );
  };

  const onMonitorLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !pointer.current.active) return;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    if (viewRef.current === 'screen' && camera.current.ready && !mobileExpandedRef.current)
      scheduleExit('screen');
  };

  const onPortraitLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !pointer.current.active) return;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    clearPortraitEnterTimer();
    if (viewRef.current === 'portrait' && camera.current.ready && !mobileExpandedRef.current)
      scheduleExit('portrait');
  };

  const checkHover = () => {
    if (!pointer.current.active || !camera.current.ready || mobileExpandedRef.current) {
      clearExitTimer();
      clearPortraitEnterTimer();
      return;
    }
    const { x, y } = pointer.current;
    if (viewRef.current === 'screen') {
      const screen = stageRef.current?.querySelector('.monitor-screen')?.getBoundingClientRect();
      if (screen && outside(x, y, screen, 10)) scheduleExit('screen');
      else clearExitTimer();
      return;
    }
    if (viewRef.current === 'portrait') {
      const portrait = stageRef.current
        ?.querySelector('.portrait-monitor')
        ?.getBoundingClientRect();
      if (portrait && outside(x, y, portrait, 10)) scheduleExit('portrait');
      else clearExitTimer();
      return;
    }
    if (viewRef.current === 'desk') {
      const screen = stageRef.current?.querySelector('.monitor-screen')?.getBoundingClientRect();
      const portrait = stageRef.current
        ?.querySelector('.portrait-monitor')
        ?.getBoundingClientRect();
      if (screen && outside(x, y, screen)) hoverArmed.current = true;
      if (portrait && outside(x, y, portrait)) {
        portraitHoverArmed.current = true;
        clearPortraitEnterTimer();
      }
      if (hoverArmed.current && screen && !outside(x, y, screen)) {
        clearPortraitEnterTimer();
        enterScreen();
        return;
      }
      if (portraitHoverArmed.current && portrait && !outside(x, y, portrait)) {
        clearExitTimer();
        if (!portraitEnterTimer.current) {
          portraitEnterTimer.current = setTimeout(() => {
            portraitEnterTimer.current = null;
            if (
              viewRef.current !== 'desk' ||
              !camera.current.ready ||
              !pointer.current.active ||
              mobileExpandedRef.current
            )
              return;
            const currentPortrait = stageRef.current
              ?.querySelector('.portrait-monitor')
              ?.getBoundingClientRect();
            if (currentPortrait && !outside(pointer.current.x, pointer.current.y, currentPortrait))
              enterPortrait();
          }, portraitHoverDelay);
        }
        return;
      }
      const desk = deskRef.current?.getBoundingClientRect();
      if (desk && outside(x, y, desk, 10)) scheduleExit('desk');
      else clearExitTimer();
    }
  };
  checkHoverRef.current = checkHover;

  const followCursor = (event: PointerEvent<HTMLElement>) => {
    if (roomAsset.state !== 'ready') return;
    if (event.pointerType !== 'mouse') {
      pointer.current.active = false;
      clearExitTimer();
      clearPortraitEnterTimer();
      if (
        event.pointerType === 'touch' &&
        viewRef.current === 'room' &&
        !mobileExpandedRef.current &&
        motionStatus !== 'active' &&
        motionStatus !== 'calibrating'
      ) {
        updateRoomPose(
          (event.clientX / window.innerWidth - 0.5) * -36 * mobileRoomParallaxScale,
          (event.clientY / window.innerHeight - 0.5) * -24 * mobileRoomParallaxScale,
        );
      } else if (
        event.pointerType === 'touch' &&
        viewRef.current === 'desk' &&
        motionStatus !== 'active' &&
        motionStatus !== 'calibrating'
      ) {
        deskMotion.current.targetX =
          (event.clientX / window.innerWidth - 0.5) * 2 * mobileDeskParallaxScale;
        deskMotion.current.targetY =
          (event.clientY / window.innerHeight - 0.5) * 2 * mobileDeskParallaxScale;
        wakeCamera();
      }
      return;
    }
    pointer.current = { x: event.clientX, y: event.clientY, active: true };
    if (viewRef.current === 'desk') {
      deskMotion.current.targetX = Math.max(
        -1,
        Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2),
      );
      deskMotion.current.targetY = Math.max(
        -1,
        Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2),
      );
      wakeCamera();
    }
    if (viewRef.current !== 'room') {
      checkHover();
      return;
    }
    const desk = deskRef.current?.getBoundingClientRect();
    if (
      camera.current.current.scale < 1.05 &&
      desk &&
      !outside(event.clientX, event.clientY, desk)
    ) {
      enterDesk();
      return;
    }
    updateRoomPose(
      (event.clientX / window.innerWidth - 0.5) * -36,
      (event.clientY / window.innerHeight - 0.5) * -24,
    );
  };

  const mobileBackButton =
    (view === 'screen' || view === 'portrait') && mobileExpanded ? (
      <button
        ref={mobileBackRef}
        className="mobile-portfolio-back"
        type="button"
        onClick={handlePhoneBack}
        aria-label={
          view === 'screen' && activeApp === 'autorename' ? 'Back to portfolio' : 'Back to desk'
        }
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
          <path d="M8 4 2.5 10 8 16M3 10h14" />
        </svg>
        <span>{view === 'screen' && activeApp === 'autorename' ? 'Portfolio' : 'Back'}</span>
      </button>
    ) : null;

  const handleDesktopPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!startMenuOpen) return;
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('.desktop-start-menu, .taskbar-start'))
      setStartMenuOpen(false);
  };

  const handleExperiencePointerDown = (event: PointerEvent<HTMLElement>) => {
    unlockSound();
    const inActiveMonitor =
      (viewRef.current === 'screen' || viewRef.current === 'portrait') &&
      event.target instanceof Element &&
      Boolean(event.target.closest('.monitor-screen, .portrait-monitor'));
    if (event.button === 0 && (isInteractiveTarget(event.target) || inActiveMonitor)) {
      pressedInteractive.current = true;
      playSound('mouseDown');
    }
  };

  const handleExperiencePointerUp = () => {
    if (!pressedInteractive.current) return;
    pressedInteractive.current = false;
    playSound('mouseUp');
  };

  return (
    <main
      className="experience"
      data-view={view}
      data-expanded={mobileExpanded}
      onPointerDown={handleExperiencePointerDown}
      onPointerUp={handleExperiencePointerUp}
      onPointerCancel={() => {
        pressedInteractive.current = false;
      }}
      onPointerMove={followCursor}
    >
      <div
        className="room-stage"
        ref={stageRef}
        inert={roomAsset.state !== 'ready'}
        aria-hidden={roomAsset.state !== 'ready'}
      >
        <div className="desk-camera">
          <img
            className="room-image"
            src={roomAsset.url}
            alt="A compact loft workspace with a monitor, desk, and chair"
            draggable={false}
            fetchPriority="high"
          />{' '}
          <aside
            className="portrait-monitor"
            aria-label="Angelo Palpalatoc CV"
            aria-hidden={view === 'room' || view === 'screen'}
            onPointerLeave={onPortraitLeave}
          >
            <div className="portrait-surface">
              <PortraitCvViewer
                cvUrl={cvUrl}
                active={view === 'portrait'}
                windowRef={portraitWindowRef}
                onClose={leavePortrait}
                mobileBackButton={view === 'portrait' ? mobileBackButton : null}
              />
            </div>
            {view === 'desk' && (
              <button
                ref={portraitMonitorRef}
                className="portrait-monitor-hotspot"
                type="button"
                aria-label="Zoom into the portrait monitor to read or download Angelo Palpalatoc's CV"
                onClick={() => {
                  pointer.current.active = false;
                  enterPortrait();
                }}
              >
                <span className="portrait-monitor-badge">VIEW CV</span>
              </button>
            )}
          </aside>
          <div className="monitor-screen" onPointerLeave={onMonitorLeave}>
            <div className="monitor-surface">
              <div
                className="monitor-desktop"
                style={{
                  backgroundImage:
                    wallpaperAsset.state === 'ready' ? `url("${wallpaperAsset.url}")` : 'none',
                }}
                aria-label="Desktop background"
                aria-hidden={view !== 'screen' || mobileExpanded}
                inert={view !== 'screen' || mobileExpanded}
                onPointerDown={handleDesktopPointerDown}
              >
                {activeApp === null && (
                  <div className="desktop-shortcuts" aria-label="Desktop apps">
                    <button
                      className="desktop-shortcut"
                      ref={desktopAppRef}
                      type="button"
                      onClick={() => openApp('arduino')}
                    >
                      <img
                        className="desktop-shortcut-icon"
                        src="/portfolio-logo.webp"
                        alt=""
                        draggable={false}
                      />
                      <span className="desktop-shortcut-label">Portfolio</span>
                    </button>
                    <button
                      className="desktop-shortcut"
                      ref={autoRenameRef}
                      type="button"
                      onClick={() => openApp('autorename')}
                    >
                      <img
                        className="desktop-shortcut-icon"
                        src="/autorenamer-icon.svg"
                        alt=""
                        draggable={false}
                      />
                      <span className="desktop-shortcut-label">Sec Renamer</span>
                    </button>
                  </div>
                )}
                <div
                  className={`desktop-taskbar${startMenuOpen ? ' is-open' : ''}`}
                  aria-label="Taskbar; move the pointer to the bottom edge to reveal"
                >
                  <button
                    ref={startButtonRef}
                    className="taskbar-start"
                    type="button"
                    aria-label="Open Start menu"
                    aria-expanded={startMenuOpen}
                    onClick={() => setStartMenuOpen((value) => !value)}
                  >
                    <svg className="windows-logo" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M2 3.8 10.7 2.5v8.8H2V3.8Z" />
                      <path d="M12.3 2.25 22 1v10.3h-9.7V2.25Z" />
                      <path d="M2 12.7h8.7v8.8L2 20.2v-7.5Z" />
                      <path d="M12.3 12.7H22V23l-9.7-1.25v-9.05Z" />
                    </svg>
                  </button>
                  <div className="taskbar-apps" aria-label="Available apps">
                    <button
                      className={`taskbar-app${openApps.arduino ? ' is-running' : ''}${activeApp === 'arduino' ? ' is-active' : ''}`}
                      type="button"
                      aria-label={activeApp === 'arduino' ? 'Minimize Portfolio' : 'Open Portfolio'}
                      aria-pressed={activeApp === 'arduino'}
                      onClick={() => activateTaskbarApp('arduino')}
                    >
                      <img src="/portfolio-logo.webp" alt="" draggable={false} />
                      <span className="taskbar-tooltip">Portfolio</span>
                    </button>
                    <button
                      className={`taskbar-app${openApps.autorename ? ' is-running' : ''}${activeApp === 'autorename' ? ' is-active' : ''}`}
                      type="button"
                      aria-label={
                        activeApp === 'autorename' ? 'Minimize Sec Renamer' : 'Open Sec Renamer'
                      }
                      aria-pressed={activeApp === 'autorename'}
                      onClick={() => activateTaskbarApp('autorename')}
                    >
                      <img src="/autorenamer-icon.svg" alt="" draggable={false} />
                      <span className="taskbar-tooltip">Sec Renamer</span>
                    </button>
                  </div>
                </div>
                {startMenuOpen && (
                  <div
                    ref={startMenuRef}
                    className="desktop-start-menu"
                    role="menu"
                    aria-label="Start menu"
                  >
                    <div className="start-menu-topline">
                      <span className="start-menu-hamburger" aria-hidden="true">
                        ☰
                      </span>
                      <span>Recently added</span>
                    </div>
                    <div className="start-menu-heading">PORTFOLIO APPS</div>
                    <button
                      className="start-menu-app"
                      type="button"
                      role="menuitem"
                      onClick={() => openApp('arduino')}
                    >
                      <img src="/portfolio-logo.webp" alt="" draggable={false} />
                      <span>
                        <strong>Portfolio</strong>
                        <small>Arduino IDE workspace</small>
                      </span>
                    </button>
                    <button
                      className="start-menu-app"
                      type="button"
                      role="menuitem"
                      onClick={() => openApp('autorename')}
                    >
                      <img src="/autorenamer-icon.svg" alt="" draggable={false} />
                      <span>
                        <strong>Sec Renamer</strong>
                        <small>Mobile app demo</small>
                      </span>
                    </button>
                  </div>
                )}
                {wallpaperAsset.state !== 'ready' && (
                  <div className="wallpaper-loading">
                    <LoadNotice
                      state={wallpaperAsset.state}
                      subject="desktop background"
                      onRetry={wallpaperAsset.retry}
                    />
                  </div>
                )}
              </div>
              {openApps.arduino && (
                <section
                  className={`arduino-window monitor-app-window${windowMaximized && activeApp === 'arduino' ? ' window-maximized' : ''}${activeApp !== 'arduino' ? ' is-minimized' : ''}`}
                  id="portfolio-window"
                  aria-label="Angelo's Arduino IDE portfolio"
                  aria-hidden={view !== 'screen' || activeApp !== 'arduino'}
                  inert={view !== 'screen' || activeApp !== 'arduino'}
                >
                  <header className="arduino-window-titlebar">
                    <img
                      className="arduino-app-mark"
                      src="/portfolio-logo.webp"
                      alt=""
                      aria-hidden="true"
                    />
                    <span className="window-title">
                      Portfolio.ino <span>— Arduino IDE 2.3.10 · Angelo Palpalatoc</span>
                    </span>
                    <div className="window-controls" aria-label="Arduino IDE window controls">
                      <button
                        className="window-control"
                        type="button"
                        onClick={minimizeApp}
                        aria-label="Minimize Arduino IDE"
                      >
                        —
                      </button>
                      <button
                        className="window-control"
                        type="button"
                        onClick={toggleMaximize}
                        aria-label={
                          windowMaximized ? 'Restore Arduino IDE' : 'Maximize Arduino IDE'
                        }
                      >
                        {windowMaximized ? '▣' : '□'}
                      </button>
                      <button
                        className="window-control window-close"
                        type="button"
                        onClick={() => closeApp('arduino')}
                        aria-label="Close Arduino IDE"
                      >
                        ×
                      </button>
                    </div>
                  </header>
                  <div ref={reactPortfolioRef} tabIndex={-1} className="portfolio-content">
                    <Suspense fallback={null}>
                      <ArduinoPortfolio
                        onOpenSecRename={() => openApp('autorename')}
                        onReady={onPortfolioReady}
                      />
                    </Suspense>
                  </div>
                  {activeApp === 'arduino' ? mobileBackButton : null}
                </section>
              )}
              {openApps.autorename && (
                <section
                  ref={autoRenameWindowRef}
                  tabIndex={-1}
                  className={`autorename-window monitor-app-window${windowMaximized && activeApp === 'autorename' ? ' window-maximized' : ''}${activeApp !== 'autorename' ? ' is-minimized' : ''}`}
                  id="autorenamer-window"
                  aria-label="Sec Renamer interactive mobile demo"
                  aria-hidden={view !== 'screen' || activeApp !== 'autorename'}
                  inert={view !== 'screen' || activeApp !== 'autorename'}
                >
                  <header className="arduino-window-titlebar">
                    <img className="rename-window-mark" src="/autorenamer-icon.svg" alt="" />
                    <span className="window-title">
                      Sec Renamer <span>— interactive mobile demo</span>
                    </span>
                    <button
                      className="rename-return-button"
                      type="button"
                      onClick={() => openApp('arduino')}
                    >
                      Back to Portfolio
                    </button>
                    <div className="window-controls" aria-label="Sec Renamer window controls">
                      <button
                        className="window-control"
                        type="button"
                        onClick={minimizeApp}
                        aria-label="Minimize Sec Renamer"
                      >
                        —
                      </button>
                      <button
                        className="window-control"
                        type="button"
                        onClick={toggleMaximize}
                        aria-label={
                          windowMaximized ? 'Restore Sec Renamer' : 'Maximize Sec Renamer'
                        }
                      >
                        {windowMaximized ? '▣' : '□'}
                      </button>
                      <button
                        className="window-control window-close"
                        type="button"
                        onClick={() => closeApp('autorename')}
                        aria-label="Close Sec Renamer"
                      >
                        ×
                      </button>
                    </div>
                  </header>
                  <AutoRenameDemo />
                  {activeApp === 'autorename' ? mobileBackButton : null}
                </section>
              )}
            </div>
            {view === 'desk' && (
              <button
                className="screen-hotspot"
                ref={hotspotRef}
                type="button"
                aria-label="View the desktop apps on the monitor"
                onClick={() => {
                  pointer.current.active = false;
                  enterScreen();
                }}
              />
            )}
          </div>
          <button
            className="desk-hotspot"
            ref={deskRef}
            type="button"
            aria-label="Approach the computer desk"
            aria-hidden={view !== 'room'}
            tabIndex={view === 'room' ? 0 : -1}
            onClick={() => {
              pointer.current.active = false;
              enterDesk();
            }}
          />
        </div>
      </div>

      {view === 'room' &&
        ['prompt', 'requesting', 'calibrating', 'denied', 'unavailable'].includes(motionStatus) && (
          <aside className="motion-prompt" aria-label="Motion view setup" aria-live="polite">
            <span className="motion-prompt-kicker">OPTIONAL MOTION VIEW</span>
            <p>
              {motionStatus === 'requesting'
                ? 'Waiting for motion permission…'
                : motionStatus === 'calibrating'
                  ? 'Hold your phone comfortably while motion calibrates…'
                  : motionStatus === 'denied'
                    ? 'Motion permission was not granted.'
                    : motionStatus === 'unavailable'
                      ? 'No motion readings were detected.'
                      : 'Tilt your phone to look around the room.'}
            </p>
            {motionStatus === 'prompt' ? (
              <button type="button" onClick={requestMotionPermission}>
                Enable motion view
              </button>
            ) : motionStatus === 'denied' || motionStatus === 'unavailable' ? (
              <button type="button" onClick={disableMotion}>
                Continue with touch
              </button>
            ) : null}
            <span className="motion-prompt-hint">Touch movement is always available.</span>
          </aside>
        )}

      {(view === 'room' || view === 'desk') &&
        (motionStatus === 'active' || motionStatus === 'off') && (
          <div className="motion-toolbar" role="group" aria-label="Motion view controls">
            <span className="motion-toolbar-status">
              <span aria-hidden="true" className={motionStatus === 'off' ? 'is-off' : ''} />
              {motionStatus === 'active' ? 'Motion on' : 'Motion off'}
            </span>
            {motionStatus === 'active' ? (
              <>
                <button type="button" onClick={recenterMotion}>
                  Recenter
                </button>
                <button type="button" onClick={disableMotion}>
                  Turn off
                </button>
              </>
            ) : (
              <button type="button" onClick={requestMotionPermission}>
                Enable
              </button>
            )}
          </div>
        )}

      <button
        className={`sound-toggle${soundEnabled ? ' is-on' : ''}`}
        type="button"
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        title={soundEnabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)'}
        onClick={toggleSound}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
          <path d="M3.5 7.5H7L11.5 3.8V16.2L7 12.5H3.5Z" />
          {soundEnabled ? (
            <>
              <path d="M14.2 7.2C15.1 8.1 15.6 9 15.6 10C15.6 11 15.1 11.9 14.2 12.8" />
              <path d="M16.4 5.2C17.8 6.5 18.5 8.1 18.5 10C18.5 11.9 17.8 13.5 16.4 14.8" />
            </>
          ) : (
            <path d="M14.2 7.5L18.2 12.5M18.2 7.5L14.2 12.5" />
          )}
        </svg>
        <span>{soundEnabled ? 'Sound on' : 'Sound off'}</span>
      </button>

      {view === 'desk' && (
        <button className="mobile-room-button" type="button" onClick={leaveDesk}>
          Back to room
        </button>
      )}

      <section
        className="room-caption"
        aria-hidden={view !== 'room' || roomAsset.state !== 'ready'}
        inert={view !== 'room' || roomAsset.state !== 'ready'}
        aria-label="Angelo Palpalatoc portfolio overview"
      >
        <span className="caption-kicker">
          <span className="caption-line" /> ANGELO PALPALATOC · FULL-STACK ENGINEER
        </span>
        <h1 className="caption-title">Come on in. My work is on screen.</h1>
        <span className="caption-stack">
          React · TypeScript · Python · FastAPI · PostgreSQL · AI Workflows
        </span>
        <span className="caption-hint">
          Approach the desk to inspect the monitors — portfolio on the right, CV on the left.
        </span>
      </section>

      {roomAsset.state !== 'ready' && (
        <div className="room-loading">
          <LoadNotice state={roomAsset.state} subject="room" onRetry={roomAsset.retry} />
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </main>
  );
}
