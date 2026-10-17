/**
 * Tiny audio utility. Nothing plays until the visitor enables sound (a user gesture).
 * Missing or blocked files fail silently, so the site works fine with no audio at all.
 */
export type Sfx = 'dialClick' | 'tuneIn';

const FILES: Record<Sfx | 'static', string> = {
  dialClick: '/assets/audio/dial-click.wav',
  tuneIn: '/assets/audio/tune-in.wav',
  static: '/assets/audio/static-loop.wav',
};

let enabled = false;
const cache: Partial<Record<keyof typeof FILES, HTMLAudioElement>> = {};

function get(name: keyof typeof FILES): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!cache[name]) {
    const el = new Audio(FILES[name]);
    el.preload = 'auto';
    cache[name] = el;
  }
  return cache[name] ?? null;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (on) startAmbient();
  else stopAmbient();
}

export function playSfx(name: Sfx, volume = 0.6): void {
  if (!enabled) return;
  const el = get(name);
  if (!el) return;
  try {
    el.currentTime = 0;
    el.volume = volume;
    void el.play().catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function startAmbient(volume = 0.07): void {
  if (!enabled) return;
  const el = get('static');
  if (!el) return;
  el.loop = true;
  el.volume = volume;
  void el.play().catch(() => undefined);
}

export function stopAmbient(): void {
  const el = cache.static;
  if (el) el.pause();
}
