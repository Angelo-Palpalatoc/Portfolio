import { useSyncExternalStore } from 'react';

export type SoundEffect =
  | 'mouseDown'
  | 'mouseUp'
  | 'click'
  | 'key'
  | 'zoomIn'
  | 'zoomOut'
  | 'windowOpen'
  | 'windowClose'
  | 'chime';

/** Tune audio balance here (0 = silent, 1 = full). */
const soundConfig = {
  masterGain: 0.72,
  mouseDownVolume: 1.0,
  mouseUpVolume: 0.85,
  keyVolume: 0.9,
  zoomVolume: 0.75,
  chimeVolume: 0.85,
} as const;

const storageKey = 'portfolio-sound-enabled';
const listeners = new Set<() => void>();
const lastPlayedAt: Partial<Record<SoundEffect, number>> = {};

let audioContext: AudioContext | null = null;
let masterBus: GainNode | null = null;
let snapBuffer: AudioBuffer | null = null;
let bodyBuffer: AudioBuffer | null = null;
let unlocked = false;

function readInitialEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved === null ? true : saved === '1';
  } catch {
    return true;
  }
}

let soundEnabled = readInitialEnabled();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(next: boolean): void {
  if (soundEnabled === next) return;
  soundEnabled = next;
  try {
    window.localStorage.setItem(storageKey, next ? '1' : '0');
  } catch {
    // Ignore storage errors in restricted contexts.
  }
  emit();
}

function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribeSound, getSoundEnabled, () => true);
}

function getContext(): { ctx: AudioContext; bus: GainNode } | null {
  if (typeof window === 'undefined') return null;
  const AudioCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  try {
    if (!audioContext) {
      audioContext = new AudioCtor();
      // Preserve crisp 3–7 kHz mechanical transients while rolling off harsh air above 11 kHz.
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 11000;
      filter.Q.value = 0.5;

      masterBus = audioContext.createGain();
      masterBus.gain.value = soundConfig.masterGain;
      masterBus.connect(filter);
      filter.connect(audioContext.destination);
    }
    return masterBus ? { ctx: audioContext, bus: masterBus } : null;
  } catch {
    return null;
  }
}

function getImpulseBuffers(ctx: AudioContext): { snap: AudioBuffer; body: AudioBuffer } {
  if (
    snapBuffer &&
    bodyBuffer &&
    snapBuffer.sampleRate === ctx.sampleRate &&
    bodyBuffer.sampleRate === ctx.sampleRate
  ) {
    return { snap: snapBuffer, body: bodyBuffer };
  }

  // Sharp 5.5 ms metallic micro-switch impulse.
  const snapLen = Math.max(1, Math.floor(ctx.sampleRate * 0.0055));
  const snap = ctx.createBuffer(1, snapLen, ctx.sampleRate);
  const snapData = snap.getChannelData(0);
  for (let i = 0; i < snapLen; i += 1) {
    snapData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / snapLen, 5.8);
  }

  // Short 13 ms damped transient for plastic housing resonance.
  const bodyLen = Math.max(1, Math.floor(ctx.sampleRate * 0.013));
  const body = ctx.createBuffer(1, bodyLen, ctx.sampleRate);
  const bodyData = body.getChannelData(0);
  for (let i = 0; i < bodyLen; i += 1) {
    bodyData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bodyLen, 3.4);
  }

  snapBuffer = snap;
  bodyBuffer = body;
  return { snap, body };
}

function jitter(spread = 0.06): number {
  return 1 + (Math.random() * 2 - 1) * spread;
}

/** Unlock the AudioContext on the first explicit user gesture. */
export function unlockSound(): void {
  if (unlocked) return;
  const engine = getContext();
  if (!engine) return;
  unlocked = true;
  if (engine.ctx.state === 'suspended') {
    void engine.ctx.resume().catch(() => {});
  }
}

function scheduleTone(
  ctx: AudioContext,
  bus: GainNode,
  options: {
    type?: OscillatorType;
    startFreq: number;
    endFreq?: number;
    startOffset?: number;
    attack?: number;
    duration: number;
    gain: number;
  },
) {
  const {
    type = 'sine',
    startFreq,
    endFreq = startFreq,
    startOffset = 0,
    attack = 0.005,
    duration,
    gain,
  } = options;
  const start = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, start);
  if (endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
  }
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.linearRampToValueAtTime(gain, start + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(bus);
  osc.start(start);
  osc.stop(start + duration + 0.015);
}

function scheduleImpulse(
  ctx: AudioContext,
  bus: GainNode,
  buffer: AudioBuffer,
  options: {
    filterType: BiquadFilterType;
    freq: number;
    q: number;
    gain: number;
    startOffset?: number;
  },
) {
  const { filterType, freq, q, gain, startOffset = 0 } = options;
  const start = ctx.currentTime + startOffset;
  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(freq, start);
  filter.Q.setValueAtTime(q, start);

  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, start);

  src.connect(filter);
  filter.connect(amp);
  amp.connect(bus);
  src.start(start);
}

function playMouseDown(ctx: AudioContext, bus: GainNode, offset = 0) {
  const { snap, body } = getImpulseBuffers(ctx);
  const f = jitter(0.06);
  const v = jitter(0.07) * soundConfig.mouseDownVolume;
  // Crisp micro-switch leaf snap (4.6 kHz) + high tactile sheen
  scheduleImpulse(ctx, bus, snap, {
    filterType: 'bandpass',
    freq: 4600 * f,
    q: 1.5,
    gain: 0.23 * v,
    startOffset: offset,
  });
  scheduleImpulse(ctx, bus, snap, {
    filterType: 'highpass',
    freq: 2500 * f,
    q: 0.7,
    gain: 0.075 * v,
    startOffset: offset,
  });
  // Damped plastic mouse body resonance (~860 Hz)
  scheduleImpulse(ctx, bus, body, {
    filterType: 'bandpass',
    freq: 860 * f,
    q: 2.3,
    gain: 0.16 * v,
    startOffset: offset,
  });
  scheduleTone(ctx, bus, {
    type: 'sine',
    startFreq: 185 * f,
    endFreq: 92,
    startOffset: offset,
    attack: 0.001,
    duration: 0.007,
    gain: 0.05 * v,
  });
}

function playMouseUp(ctx: AudioContext, bus: GainNode, offset = 0) {
  const { snap, body } = getImpulseBuffers(ctx);
  const f = jitter(0.06);
  const v = jitter(0.07) * soundConfig.mouseUpVolume;
  // Lighter, slightly brighter micro-switch release
  scheduleImpulse(ctx, bus, snap, {
    filterType: 'bandpass',
    freq: 5800 * f,
    q: 1.8,
    gain: 0.12 * v,
    startOffset: offset,
  });
  scheduleImpulse(ctx, bus, body, {
    filterType: 'bandpass',
    freq: 1220 * f,
    q: 2.4,
    gain: 0.065 * v,
    startOffset: offset,
  });
}

function playKeyThock(ctx: AudioContext, bus: GainNode) {
  const { snap, body } = getImpulseBuffers(ctx);
  const f = jitter(0.05);
  const v = jitter(0.07) * soundConfig.keyVolume;
  // Warm damped mechanical keycap thock
  scheduleImpulse(ctx, bus, body, {
    filterType: 'bandpass',
    freq: 620 * f,
    q: 2.6,
    gain: 0.19 * v,
  });
  scheduleImpulse(ctx, bus, snap, {
    filterType: 'bandpass',
    freq: 3100 * f,
    q: 1.6,
    gain: 0.11 * v,
  });
  scheduleTone(ctx, bus, {
    type: 'sine',
    startFreq: 155 * f,
    endFreq: 82,
    attack: 0.001,
    duration: 0.011,
    gain: 0.058 * v,
  });
}

export function playSound(effect: SoundEffect): void {
  if (!soundEnabled || !unlocked) return;
  const now = performance.now();
  const cooldown =
    effect === 'zoomIn' || effect === 'zoomOut'
      ? 180
      : effect === 'mouseDown' || effect === 'mouseUp'
        ? 20
        : 45;
  if (now - (lastPlayedAt[effect] ?? 0) < cooldown) return;
  lastPlayedAt[effect] = now;

  const engine = getContext();
  if (!engine) return;
  const { ctx, bus } = engine;
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {});
  }

  switch (effect) {
    case 'mouseDown':
      playMouseDown(ctx, bus);
      break;
    case 'mouseUp':
      playMouseUp(ctx, bus);
      break;
    case 'click':
      playMouseDown(ctx, bus, 0);
      playMouseUp(ctx, bus, 0.036);
      break;
    case 'key':
      playKeyThock(ctx, bus);
      break;
    case 'zoomIn':
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 196,
        endFreq: 293.66,
        attack: 0.018,
        duration: 0.125,
        gain: 0.044 * soundConfig.zoomVolume,
      });
      break;
    case 'zoomOut':
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 277.18,
        endFreq: 196,
        attack: 0.014,
        duration: 0.105,
        gain: 0.04 * soundConfig.zoomVolume,
      });
      break;
    case 'windowOpen':
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 392,
        duration: 0.045,
        attack: 0.004,
        gain: 0.044 * soundConfig.chimeVolume,
      });
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 523.25,
        startOffset: 0.032,
        duration: 0.065,
        attack: 0.004,
        gain: 0.05 * soundConfig.chimeVolume,
      });
      break;
    case 'windowClose':
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 440,
        duration: 0.038,
        attack: 0.004,
        gain: 0.04 * soundConfig.chimeVolume,
      });
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 329.63,
        startOffset: 0.028,
        duration: 0.055,
        attack: 0.004,
        gain: 0.038 * soundConfig.chimeVolume,
      });
      break;
    case 'chime':
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 523.25,
        attack: 0.007,
        duration: 0.21,
        gain: 0.056 * soundConfig.chimeVolume,
      });
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 1046.5,
        attack: 0.008,
        duration: 0.14,
        gain: 0.012 * soundConfig.chimeVolume,
      });
      scheduleTone(ctx, bus, {
        type: 'sine',
        startFreq: 783.99,
        startOffset: 0.055,
        attack: 0.008,
        duration: 0.24,
        gain: 0.06 * soundConfig.chimeVolume,
      });
      break;
  }
}
