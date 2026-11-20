import { describe, expect, it } from 'vitest';
import { getSoundEnabled, playSound, setSoundEnabled, unlockSound } from './sound';

describe('sound controller', () => {
  it('toggles sound state cleanly and stays safe without Web Audio', () => {
    const initial = getSoundEnabled();
    setSoundEnabled(false);
    expect(getSoundEnabled()).toBe(false);
    expect(() => unlockSound()).not.toThrow();
    expect(() => playSound('mouseDown')).not.toThrow();
    expect(() => playSound('mouseUp')).not.toThrow();
    expect(() => playSound('key')).not.toThrow();
    expect(() => playSound('chime')).not.toThrow();

    setSoundEnabled(true);
    expect(getSoundEnabled()).toBe(true);
    expect(() => playSound('click')).not.toThrow();
    setSoundEnabled(initial);
  });
});
