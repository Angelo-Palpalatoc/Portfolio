import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import roomImage from './assets/room.webp';
import monitorBackground from './assets/desktop-background.webp';
import { monitorProjection } from './monitorProjection';
import { LoadNotice, useImageAsset } from './LoadingState';
import PortfolioFrame from './PortfolioFrame';
import AutoRenameDemo from './AutoRenameDemo';

const ideWidth = 1280;
const deskParallaxIntensity = 1.3;
const deskBounds = { left: 0.28, top: 0.355, width: 0.59, height: 0.28 };
const deskCenter = { x: 0.575, y: 0.495 };
const screenCenter = { x: 0.5635, y: 0.5109 };
const mobileRoomParallaxScale = 0.8;
const mobileRoomTiltRange = 18;
const mobileDeskParallaxScale = 0.65;
const phoneQuery =
  '(max-width: 700px), (max-width: 950px) and (pointer: coarse), (max-width: 950px) and (max-height: 500px)';
type View = 'room' | 'desk' | 'screen';
type AppWindow = 'arduino' | 'autorename' | null;
type CameraPose = { x: number; y: number; scale: number };
type MotionPermission = 'hidden' | 'prompt' | 'granted' | 'denied' | 'unsupported';
const initialPose = { x: 0, y: 0, scale: 1 };
const outside = (x: number, y: number, rect: DOMRect, margin = 0) =>
  x < rect.left - margin ||
  x > rect.right + margin ||
  y < rect.top - margin ||
  y > rect.bottom + margin;

export default function App() {
  const [view, setView] = useState<View>('room');
  const [activeApp, setActiveApp] = useState<AppWindow>('arduino');
  const [windowMaximized, setWindowMaximized] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [motionPermission, setMotionPermission] = useState<MotionPermission>('hidden');
  const roomAsset = useImageAsset(roomImage);
  const wallpaperAsset = useImageAsset(monitorBackground);
  const [status, setStatus] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLButtonElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const desktopAppRef = useRef<HTMLButtonElement>(null);
  const autoRenameRef = useRef<HTMLButtonElement>(null);
  const autoRenameWindowRef = useRef<HTMLElement>(null);
  const mobileBackRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mobileExpandedRef = useRef(mobileExpanded);
  mobileExpandedRef.current = mobileExpanded;
  const hoverArmed = useRef(true);
  const interacted = useRef(false);
  const viewRef = useRef<View>('room');
  const poses = useRef<Record<View, CameraPose>>({
    room: initialPose,
    desk: initialPose,
    screen: initialPose,
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
  const pointer = useRef({ x: 0, y: 0, active: false });
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      motion.frequency = destination === 'screen' ? 6 : 8;
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
    const screenZoom = Math.max(
      1,
      Math.min(
        (window.innerWidth * 0.866) / screenWidth,
        (window.innerHeight * 0.9) / screenHeight,
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

  const enterDesk = () => {
    if (viewRef.current !== 'room') return;
    interacted.current = true;
    clearExitTimer();
    orientationBaseline.current = null;
    setStartMenuOpen(false);
    measureScene();
    viewRef.current = 'desk';
    aimCamera(poses.current.desk, 'desk');
    setView('desk');
    setStatus('At the desk. Hover over the monitor to use the desktop and apps.');
  };

  const enterScreen = () => {
    if (viewRef.current !== 'desk') return;
    interacted.current = true;
    clearExitTimer();
    measureScene();
    viewRef.current = 'screen';
    aimCamera(poses.current.screen, 'screen');
    setView('screen');
    const mobile = window.matchMedia(phoneQuery).matches;
    setMobileExpanded(mobile);
    setStatus(
      mobile
        ? `${activeApp === 'autorename' ? 'AutoRename' : 'Arduino IDE'} open in phone reading view.`
        : `${activeApp === 'arduino' ? 'Arduino IDE' : activeApp === 'autorename' ? 'AutoRename' : 'Desktop'} open inside the monitor. Press Escape or move away to return to the desk.`,
    );
  };

  const closeApp = () => {
    const name = activeApp === 'autorename' ? 'AutoRename' : 'Arduino IDE';
    setActiveApp(null);
    setWindowMaximized(false);
    setStartMenuOpen(false);
    setMobileExpanded(false);
    setStatus(`${name} closed. Choose a desktop icon to open an app.`);
  };

  const minimizeApp = () => {
    setActiveApp(null);
    setWindowMaximized(false);
    setStartMenuOpen(false);
    setStatus(
      `${activeApp === 'autorename' ? 'AutoRename' : 'Arduino IDE'} minimized to the desktop.`,
    );
  };

  const openApp = useCallback((app: Exclude<AppWindow, null> = 'arduino') => {
    setActiveApp(app);
    setWindowMaximized(false);
    setStartMenuOpen(false);
    setStatus(`${app === 'autorename' ? 'AutoRename' : 'Arduino IDE'} opened.`);
  }, []);

  const toggleMaximize = () => setWindowMaximized((value) => !value);

  const leaveScreen = useCallback(() => {
    if (viewRef.current !== 'screen') return;
    interacted.current = true;
    clearExitTimer();
    setStartMenuOpen(false);
    hoverArmed.current = false;
    setMobileExpanded(false);
    viewRef.current = 'desk';
    aimCamera(poses.current.desk, 'desk');
    setView('desk');
    setStatus('Back at the desk. Move away to see the room.');
  }, [aimCamera, clearExitTimer]);

  const handlePhoneBack = () => {
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
    orientationBaseline.current = null;
    setStartMenuOpen(false);
    viewRef.current = 'room';
    aimCamera(poses.current.room, 'room');
    setView('room');
    setStatus('Back in the room. Explore the computer setup to approach the desk.');
  }, [aimCamera, clearExitTimer]);

  const onNavigationKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
        return;
      }
      if (event.key !== 'Escape') return;
      if (viewRef.current === 'screen' && mobileExpandedRef.current) {
        if (activeApp === 'autorename') openApp('arduino');
        else leaveScreen();
      } else if (viewRef.current === 'screen') leaveScreen();
      else if (viewRef.current === 'desk') leaveDesk();
    },
    [activeApp, openApp, leaveScreen, leaveDesk, clearExitTimer, startMenuOpen],
  );

  // Responsive measurements, keyboard navigation, and focus management.
  useLayoutEffect(() => {
    // The same iframe expands; changing viewport size must also restore the
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
      if (camera.current.frame) cancelAnimationFrame(camera.current.frame);
      camera.current.frame = 0;
      camera.current.lastTime = 0;
    };
  }, [measureScene, clearExitTimer]);

  useLayoutEffect(() => {
    if (!interacted.current) return;
    if (view === 'screen' && window.matchMedia(phoneQuery).matches)
      mobileBackRef.current?.focus({ preventScroll: true });
    else if (view === 'screen' && activeApp === 'arduino')
      frameRef.current?.focus({ preventScroll: true });
    else if (view === 'screen' && activeApp === 'autorename')
      autoRenameWindowRef.current?.focus({ preventScroll: true });
    else if (view === 'screen') desktopAppRef.current?.focus({ preventScroll: true });
    else if (view === 'desk') hotspotRef.current?.focus({ preventScroll: true });
    else deskRef.current?.focus({ preventScroll: true });
  }, [view, activeApp, mobileExpanded]);

  useLayoutEffect(() => {
    window.addEventListener('keydown', onNavigationKeyDown);
    return () => window.removeEventListener('keydown', onNavigationKeyDown);
  }, [onNavigationKeyDown]);

  useLayoutEffect(() => {
    const openDemoFromPortfolio = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== 'open-autorenamer-demo'
      )
        return;
      setActiveApp('autorename');
      setWindowMaximized(false);
      setStatus('AutoRename mobile demo opened.');
    };
    window.addEventListener('message', openDemoFromPortfolio);
    return () => window.removeEventListener('message', openDemoFromPortfolio);
  }, []);

  const onPortfolioReady = useCallback(() => {
    if (
      interacted.current &&
      viewRef.current === 'screen' &&
      !mobileExpandedRef.current &&
      !window.matchMedia(phoneQuery).matches
    )
      frameRef.current?.focus({ preventScroll: true });
  }, []);

  const requestMotionPermission = useCallback(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotionPermission('unsupported');
      return;
    }
    if (!('DeviceOrientationEvent' in window)) {
      setMotionPermission('unsupported');
      return;
    }
    try {
      const OrientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      const result = OrientationEvent.requestPermission
        ? await OrientationEvent.requestPermission()
        : 'granted';
      if (result !== 'granted') {
        setMotionPermission('denied');
        return;
      }
      orientationBaseline.current = null;
      setMotionPermission('granted');
    } catch {
      setMotionPermission('denied');
    }
  }, []);

  useLayoutEffect(() => {
    const phone = window.matchMedia(phoneQuery);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPrompt = () => {
      if (
        phone.matches &&
        !reducedMotion.matches &&
        'DeviceOrientationEvent' in window &&
        motionPermission === 'hidden'
      ) {
        setMotionPermission('prompt');
      } else if (!phone.matches && motionPermission !== 'hidden') {
        setMotionPermission('hidden');
        orientationBaseline.current = null;
      }
    };
    syncMotionPrompt();
    phone.addEventListener('change', syncMotionPrompt);
    reducedMotion.addEventListener('change', syncMotionPrompt);
    return () => {
      phone.removeEventListener('change', syncMotionPrompt);
      reducedMotion.removeEventListener('change', syncMotionPrompt);
    };
  }, [motionPermission]);

  useLayoutEffect(() => {
    if (motionPermission !== 'granted') return;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (viewRef.current === 'screen' || mobileExpandedRef.current) return;
      if (event.beta == null || event.gamma == null) return;
      if (!orientationBaseline.current) {
        orientationBaseline.current = { beta: event.beta, gamma: event.gamma };
        return;
      }
      const deltaGamma = event.gamma - orientationBaseline.current.gamma;
      const deltaBeta = event.beta - orientationBaseline.current.beta;
      const normalizedX = Math.max(-1, Math.min(1, deltaGamma / mobileRoomTiltRange));
      const normalizedY = Math.max(-1, Math.min(1, deltaBeta / mobileRoomTiltRange));
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
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [motionPermission, updateRoomPose, wakeCamera]);

  // Pointer navigation between the room, desk, and monitor.
  const scheduleExit = (from: 'desk' | 'screen') => {
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
            : deskRef.current?.getBoundingClientRect();
        if (bounds && outside(pointer.current.x, pointer.current.y, bounds, 10)) {
          if (from === 'screen') leaveScreen();
          else leaveDesk();
        }
      },
      from === 'screen' ? 110 : 150,
    );
  };

  const onMonitorLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !pointer.current.active) return;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    if (viewRef.current === 'screen' && camera.current.ready && !mobileExpandedRef.current)
      scheduleExit('screen');
  };

  const checkHover = () => {
    if (!pointer.current.active || !camera.current.ready || mobileExpandedRef.current) {
      clearExitTimer();
      return;
    }
    const { x, y } = pointer.current;
    if (viewRef.current === 'screen') {
      const screen = stageRef.current?.querySelector('.monitor-screen')?.getBoundingClientRect();
      if (screen && outside(x, y, screen, 10)) scheduleExit('screen');
      else clearExitTimer();
      return;
    }
    if (viewRef.current === 'desk') {
      const screen = stageRef.current?.querySelector('.monitor-screen')?.getBoundingClientRect();
      if (screen && outside(x, y, screen)) hoverArmed.current = true;
      if (hoverArmed.current && screen && !outside(x, y, screen)) {
        enterScreen();
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
      if (
        event.pointerType === 'touch' &&
        viewRef.current === 'room' &&
        !mobileExpandedRef.current
      ) {
        updateRoomPose(
          (event.clientX / window.innerWidth - 0.5) * -36 * mobileRoomParallaxScale,
          (event.clientY / window.innerHeight - 0.5) * -24 * mobileRoomParallaxScale,
        );
      } else if (event.pointerType === 'touch' && viewRef.current === 'desk') {
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
    view === 'screen' && mobileExpanded ? (
      <button
        ref={mobileBackRef}
        className="mobile-portfolio-back"
        type="button"
        onClick={handlePhoneBack}
        aria-label={activeApp === 'autorename' ? 'Back to portfolio' : 'Back to desk'}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
          <path d="M8 4 2.5 10 8 16M3 10h14" />
        </svg>
        <span>{activeApp === 'autorename' ? 'Portfolio' : 'Back'}</span>
      </button>
    ) : null;

  const handleDesktopPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!startMenuOpen) return;
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('.desktop-start-menu, .taskbar-start'))
      setStartMenuOpen(false);
  };

  return (
    <main
      className="experience"
      data-view={view}
      data-expanded={mobileExpanded}
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
          />
          <div className="monitor-screen" onPointerLeave={onMonitorLeave}>
            <div className="monitor-surface">
              <div
                className="monitor-desktop"
                style={{ backgroundImage: `url("${wallpaperAsset.url}")` }}
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
                      <span className="desktop-shortcut-label">AutoRename</span>
                    </button>
                  </div>
                )}
                <div
                  className={`desktop-taskbar${startMenuOpen ? ' is-open' : ''}`}
                  aria-label="Taskbar; move the pointer to the bottom edge to reveal"
                >
                  <button
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
                      className={`taskbar-app${activeApp === 'arduino' ? ' is-active' : ''}`}
                      type="button"
                      aria-label="Open Portfolio"
                      aria-pressed={activeApp === 'arduino'}
                      onClick={() => openApp('arduino')}
                    >
                      <img src="/portfolio-logo.webp" alt="" draggable={false} />
                      <span className="taskbar-tooltip">Portfolio</span>
                    </button>
                    <button
                      className={`taskbar-app${activeApp === 'autorename' ? ' is-active' : ''}`}
                      type="button"
                      aria-label="Open AutoRename"
                      aria-pressed={activeApp === 'autorename'}
                      onClick={() => openApp('autorename')}
                    >
                      <img src="/autorenamer-icon.svg" alt="" draggable={false} />
                      <span className="taskbar-tooltip">AutoRename</span>
                    </button>
                  </div>
                </div>
                {startMenuOpen && (
                  <div className="desktop-start-menu" role="menu" aria-label="Start menu">
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
                        <strong>AutoRename</strong>
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
              {activeApp === 'arduino' && (
                <section
                  className={`arduino-window monitor-app-window${windowMaximized ? ' window-maximized' : ''}`}
                  id="portfolio-window"
                  aria-label="Angelo's Arduino IDE portfolio"
                  aria-hidden={view !== 'screen'}
                  inert={view !== 'screen'}
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
                        {windowMaximized ? '▢' : '□'}
                      </button>
                      <button
                        className="window-control window-close"
                        type="button"
                        onClick={closeApp}
                        aria-label="Close Arduino IDE"
                      >
                        ×
                      </button>
                    </div>
                  </header>
                  <PortfolioFrame
                    frameRef={frameRef}
                    onNavigationKeyDown={onNavigationKeyDown}
                    onReady={onPortfolioReady}
                  />
                  {mobileBackButton}
                </section>
              )}
              {activeApp === 'autorename' && (
                <section
                  ref={autoRenameWindowRef}
                  tabIndex={-1}
                  className={`autorename-window monitor-app-window${windowMaximized ? ' window-maximized' : ''}`}
                  id="autorenamer-window"
                  aria-label="AutoRename interactive mobile demo"
                  aria-hidden={view !== 'screen'}
                  inert={view !== 'screen'}
                >
                  <header className="arduino-window-titlebar">
                    <img className="rename-window-mark" src="/autorenamer-icon.svg" alt="" />
                    <span className="window-title">
                      AutoRename <span>— interactive mobile demo</span>
                    </span>
                    <button
                      className="rename-return-button"
                      type="button"
                      onClick={() => openApp('arduino')}
                    >
                      Back to Portfolio
                    </button>
                    <div className="window-controls" aria-label="AutoRename window controls">
                      <button
                        className="window-control"
                        type="button"
                        onClick={minimizeApp}
                        aria-label="Minimize AutoRename"
                      >
                        —
                      </button>
                      <button
                        className="window-control"
                        type="button"
                        onClick={toggleMaximize}
                        aria-label={windowMaximized ? 'Restore AutoRename' : 'Maximize AutoRename'}
                      >
                        {windowMaximized ? '▢' : '□'}
                      </button>
                      <button
                        className="window-control window-close"
                        type="button"
                        onClick={closeApp}
                        aria-label="Close AutoRename"
                      >
                        ×
                      </button>
                    </div>
                  </header>
                  <AutoRenameDemo />
                  {mobileBackButton}
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

      {view === 'room' && motionPermission === 'prompt' && (
        <aside className="motion-prompt" aria-label="Motion view setup">
          <span className="motion-prompt-kicker">OPTIONAL MOTION VIEW</span>
          <p>Tilt your phone to look around the room.</p>
          <button type="button" onClick={requestMotionPermission}>
            Enable motion view
          </button>
          <span className="motion-prompt-hint">You can still explore with touch.</span>
        </aside>
      )}

      {view === 'desk' && (
        <button className="mobile-room-button" type="button" onClick={leaveDesk}>
          Back to room
        </button>
      )}

      <section
        className="room-caption"
        aria-hidden={view !== 'room' || roomAsset.state !== 'ready'}
        inert={view !== 'room' || roomAsset.state !== 'ready'}
        aria-label="Explore the computer setup"
      >
        <span className="caption-kicker">
          <span className="caption-line" /> 01 / COMPUTER SETUP
        </span>
        <span className="caption-title">Come on in. My work is on screen.</span>
        <span className="caption-hint">
          Explore the desk, then open the monitor to see my portfolio.
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
