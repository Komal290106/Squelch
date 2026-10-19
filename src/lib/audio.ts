/**
 * Tiny audio utility. Nothing plays until the visitor enables sound (a user gesture).
 * Missing or blocked files fail silently, so the site works fine with no audio at all.
 *
 * Intro additions (no new files, no new dependencies):
 *  - playTypeTick(): a soft key-tick for the typewriter. It re-uses dial-click.wav on its OWN element,
 *    played quieter and faster, so a tick never cuts off a dial click (and vice versa).
 *  - startSearchStatic() / stopSearchStatic(): very quiet looping static while the intro is "searching".
 *    It uses the SAME single <audio> element as the ambient loop, so there is never more than one static
 *    loop, and tuning simply ramps its volume up instead of restarting it.
 *  - setIntroGate(): while the intro is mounted, turning sound on does not start the ambient loop by
 *    itself; the intro decides when the static is appropriate.
 */
export type Sfx = 'dialClick' | 'tuneIn';
type Name = Sfx | 'static' | 'tick';

const FILES: Record<Name, string> = {
  dialClick: '/assets/audio/dial-click.wav',
  tuneIn: '/assets/audio/tune-in.wav',
  static: '/assets/audio/static-loop.wav',
  tick: '/assets/audio/dial-click.wav',
};

/** Much quieter than the dial click (0.6), the tuning ambient (0.12) and the site ambient (0.07). */
export const SEARCH_STATIC_VOLUME = 0.035;
const SITE_AMBIENT_VOLUME = 0.07;
const FADE_STEP_MS = 30;

let enabled = false;
let introGate = false;
let searchWanted = false;
let fadeTimer: number | undefined;
const cache: Partial<Record<Name, HTMLAudioElement>> = {};

function get(name: Name): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!cache[name]) {
    const el = new Audio(FILES[name]);
    el.preload = 'auto';
    cache[name] = el;
  }
  return cache[name] ?? null;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function cancelFade(): void {
  if (fadeTimer !== undefined) {
    window.clearInterval(fadeTimer);
    fadeTimer = undefined;
  }
}

/** Ramp an element's volume in small steps (no sudden jumps). Only one fade runs at a time. */
function fadeTo(el: HTMLAudioElement, target: number, ms: number, done?: () => void): void {
  cancelFade();
  const goal = clamp01(target);
  const from = el.volume;
  if (ms <= 0 || from === goal) {
    el.volume = goal;
    done?.();
    return;
  }
  const steps = Math.max(1, Math.round(ms / FADE_STEP_MS));
  let i = 0;
  fadeTimer = window.setInterval(() => {
    i += 1;
    if (i >= steps) {
      cancelFade();
      el.volume = goal;
      done?.();
    } else {
      el.volume = clamp01(from + ((goal - from) * i) / steps);
    }
  }, FADE_STEP_MS);
}

/** Start the static loop if it is not already running, then ramp it to `volume`. Never restarts a running loop. */
function playAmbient(volume: number, fadeMs: number): void {
  if (!enabled) return;
  const el = get('static');
  if (!el) return;
  el.loop = true;
  if (el.paused) {
    cancelFade();
    el.volume = 0;
    void el.play().catch(() => undefined);
  }
  fadeTo(el, volume, fadeMs);
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (on) {
    if (introGate) {
      // During the intro the static only plays while it is "searching" (see startSearchStatic).
      if (searchWanted) playAmbient(SEARCH_STATIC_VOLUME, 600);
    } else {
      playAmbient(SITE_AMBIENT_VOLUME, 200);
    }
  } else {
    stopAmbient();
    stopTypeTick();
  }
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

/** Start (or smoothly adjust) the ambient static. Also hands control from the intro gate to the normal ambient. */
export function startAmbient(volume = SITE_AMBIENT_VOLUME): void {
  introGate = false;
  searchWanted = false;
  playAmbient(volume, 300);
}

export function stopAmbient(): void {
  cancelFade();
  const el = cache.static;
  if (el) el.pause();
}

/** While true, enabling sound does not start the ambient loop on its own. Set by the intro while it is mounted. */
export function setIntroGate(on: boolean): void {
  introGate = on;
}

/** Quiet "searching for someone" static. Safe to call repeatedly: it never restarts a loop that is already running. */
export function startSearchStatic(): void {
  if (!introGate) return;
  searchWanted = true;
  playAmbient(SEARCH_STATIC_VOLUME, 800);
}

/** Stop the searching static. Does nothing once tuning has taken over (so it can never cut the site ambient). */
export function stopSearchStatic(fadeMs = 250): void {
  if (!searchWanted) return;
  searchWanted = false;
  const el = cache.static;
  if (!el || el.paused) return;
  fadeTo(el, 0, fadeMs, () => el.pause());
}

/** One soft key-tick: the click sample, quiet, sped up and slightly varied. */
export function playTypeTick(): void {
  if (!enabled) return;
  const el = get('tick');
  if (!el) return;
  try {
    el.currentTime = 0;
    el.volume = 0.09 + Math.random() * 0.05;
    el.playbackRate = 1.8 + Math.random() * 0.5;
    (el as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = false;
    void el.play().catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function stopTypeTick(): void {
  const el = cache.tick;
  if (!el) return;
  try {
    el.pause();
    el.currentTime = 0;
  } catch {
    /* ignore */
  }
}