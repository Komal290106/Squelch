// @vitest-environment jsdom
//
// Final small enhancements: story copy, character sheet Story field, visit counter,
// Lowtide Ring footer detail and the cursor trail.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CursorTrail from '../components/effects/CursorTrail';
import Footer from '../components/layout/Footer';
import { parseVisits } from '../components/layout/VisitCounter';
import { character } from '../data/character';
import { scenes } from '../data/story';
import { RadioContext, useRadioProvider } from '../hooks/useRadioState';

// ---------- controllable matchMedia ----------
interface FakeMql {
  matches: boolean;
  media: string;
  listeners: Set<() => void>;
  addEventListener: (t: string, f: () => void) => void;
  removeEventListener: (t: string, f: () => void) => void;
}
const mqls: FakeMql[] = [];
let env = { finePointer: true, reducedMotion: false };

function installMatchMedia() {
  mqls.length = 0;
  window.matchMedia = ((q: string) => {
    const mql: FakeMql = {
      get matches() {
        if (q.includes('prefers-reduced-motion')) return env.reducedMotion;
        if (q.includes('pointer: fine')) return env.finePointer;
        return false;
      },
      media: q,
      listeners: new Set(),
      addEventListener(_t, f) { this.listeners.add(f); },
      removeEventListener(_t, f) { this.listeners.delete(f); },
    } as FakeMql;
    mqls.push(mql);
    return mql as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
}
const fireMediaChange = () => act(() => { mqls.forEach((m) => m.listeners.forEach((f) => f())); });

// ---------- fake canvas + animation frames ----------
let rects: number;
let getContextCalls: number;
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
let cancelled: number;
let now: number;

function installCanvas() {
  rects = 0;
  getContextCalls = 0;
  frames = new Map();
  nextFrame = 1;
  cancelled = 0;
  now = 0;
  const ctx = {
    fillRect: () => { rects += 1; },
    clearRect: () => undefined,
    setTransform: () => undefined,
    imageSmoothingEnabled: true,
    globalAlpha: 1,
    fillStyle: '',
  };
  HTMLCanvasElement.prototype.getContext = (() => { getContextCalls += 1; return ctx; }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { const id = nextFrame++; frames.set(id, cb); return id; });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { if (frames.delete(id)) cancelled += 1; });
  window.requestAnimationFrame = globalThis.requestAnimationFrame;
  window.cancelAnimationFrame = globalThis.cancelAnimationFrame;
}
/** Run queued animation frames, `step` ms apart, up to `total` ms. */
function advance(total: number, step = 16) {
  for (let t = 0; t < total; t += step) {
    now += step;
    const due = [...frames.entries()];
    frames.clear();
    due.forEach(([, cb]) => cb(now));
  }
}
function move(x: number, y: number, pointerType = 'mouse') {
  const e = new Event('pointermove') as PointerEvent;
  Object.assign(e, { clientX: x, clientY: y, pointerType });
  act(() => { window.dispatchEvent(e); });
}
function sweep(count = 10, pointerType = 'mouse') {
  for (let i = 0; i < count; i++) move(20 * i, 30 * i, pointerType);
}

beforeEach(() => {
  env = { finePointer: true, reducedMotion: false };
  installMatchMedia();
  installCanvas();
  window.localStorage.clear();
  window.sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ---------- story + character sheet ----------
describe('story', () => {
  it('keeps the four scenes and their images, with short skimmable copy', () => {
    expect(scenes.map((s) => s.id)).toEqual(['scene-factory', 'scene-empty', 'scene-station', 'scene-lamp']);
    scenes.forEach((s) => {
      expect(s.image).toMatch(/^\/assets\/backgrounds\/.+\.svg$/);
      expect(s.passages.length).toBeGreaterThanOrEqual(2);
      expect(s.passages.length).toBeLessThanOrEqual(3);
      s.passages.forEach((p) => expect(p.split(/\s+/).length).toBeLessThanOrEqual(30));
    });
  });

  it('progresses: made, goes quiet, keeps broadcasting, hopes for an answer (with the secret channel hinted, not named)', () => {
    const text = scenes.map((s) => s.passages.join(' ')).map((t) => t.toLowerCase());
    expect(text[0]).toMatch(/last shift|came off the line/);
    expect(text[1]).toMatch(/silent|quiet|stopped/);
    expect(text[2]).toMatch(/broadcasting/);
    expect(text[3]).toMatch(/answer|reply/);
    expect(text[3]).toMatch(/secret channel/);
    expect(text.join(' ')).not.toMatch(/1717/); // the AM 1717 secret stays a secret
  });

  it('character sheet has a Story field consistent with the lore', () => {
    const story = character.record.find((r) => r.label === 'Story');
    expect(story).toBeTruthy();
    expect(story!.value).toMatch(/Lowtide Hollow/);
    expect(story!.value).toMatch(/lamp/);
    ['Name', 'Is', 'Does', 'Tagline'].forEach((l) => expect(character.record.some((r) => r.label === l)).toBe(true));
  });
});

// ---------- footer: counter + ring ----------
function Wrapped() {
  const radio = useRadioProvider();
  return <RadioContext.Provider value={radio}><Footer /></RadioContext.Provider>;
}
const counterText = () => Array.from(screen.getByTestId('visit-counter').querySelectorAll('[aria-hidden] > span')).map((s) => s.textContent).filter((t) => t && /^\d$/.test(t)).join('');

describe('visit counter', () => {
  it('first visit shows 000001 and stores 1', () => {
    render(<Wrapped />);
    expect(counterText()).toBe('000001');
    expect(window.localStorage.getItem('squelch:visits')).toBe('1');
    expect(screen.getByTestId('visit-counter').textContent).toMatch(/counted in this browser only/);
  });

  it('a reload in the same session does not add a visit; a new session does', () => {
    const first = render(<Wrapped />);
    first.unmount();
    render(<Wrapped />);
    expect(counterText()).toBe('000001');
    cleanup();
    window.sessionStorage.clear(); // new browser session
    render(<Wrapped />);
    expect(counterText()).toBe('000002');
    expect(window.localStorage.getItem('squelch:visits')).toBe('2');
  });

  it.each([['abc'], ['-4'], ['3.5'], ['1e999'], ['NaN'], [' ']])('treats invalid stored value %j as 0', (bad) => {
    window.localStorage.setItem('squelch:visits', bad);
    render(<Wrapped />);
    expect(counterText()).toBe('000001');
  });

  it('continues from a valid stored count', () => {
    window.localStorage.setItem('squelch:visits', '41');
    render(<Wrapped />);
    expect(counterText()).toBe('000042');
  });

  it('parseVisits clamps huge values', () => {
    expect(parseVisits('99999999')).toBe(999999);
    expect(parseVisits(null)).toBe(0);
  });

  it('survives blocked storage without crashing and says so', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<Wrapped />);
    expect(counterText()).toBe('000001');
    expect(screen.getByTestId('visit-counter').textContent).toMatch(/storage is off/);
  });
});

describe('Lowtide Ring', () => {
  it('has prev/next links that only go to sections on this page, and nothing external in the footer', () => {
    render(<Wrapped />);
    const ring = screen.getByRole('navigation', { name: /lowtide ring/i });
    const prev = screen.getByRole('link', { name: /previous station/i });
    const next = screen.getByRole('link', { name: /next station/i });
    expect(ring.contains(prev) && ring.contains(next)).toBe(true);
    expect(prev.getAttribute('href')).toBe('#archive');
    expect(next.getAttribute('href')).toBe('#night-log');
    document.querySelectorAll('footer a[href]').forEach((a) => expect(a.getAttribute('href')).toMatch(/^#/));
    expect(ring.textContent).toMatch(/other four stations are asleep/i);
  });

  it('keeps the pilot lamp Easter egg working', () => {
    render(<Wrapped />);
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /pilot lamp/i }));
    expect(screen.getByText(/AM 1717/)).toBeTruthy();
  });
});

// ---------- cursor trail ----------
describe('cursor trail', () => {
  it('draws sparks for a mouse, then goes completely idle (no endless animation loop)', () => {
    const { container } = render(<CursorTrail />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
    expect(canvas.className).toMatch(/pointer-events-none/);
    expect(canvas.className).toMatch(/fixed/);

    expect(getContextCalls).toBe(0); // nothing is created until it is needed
    sweep();
    expect(getContextCalls).toBe(1);
    advance(100);
    expect(rects).toBeGreaterThan(0);

    advance(1500); // every spark has faded
    expect(frames.size).toBe(0);
  });

  it('caps how many sparks exist at once', () => {
    render(<CursorTrail />);
    sweep(200);
    rects = 0;
    advance(16, 16); // one frame
    expect(rects).toBeLessThanOrEqual(28 * 2);
  });

  it('does nothing on touch-first devices', () => {
    env.finePointer = false;
    render(<CursorTrail />);
    sweep();
    advance(200);
    expect(getContextCalls).toBe(0);
    expect(rects).toBe(0);
    expect(frames.size).toBe(0);
  });

  it('does nothing when reduced motion is requested', () => {
    env.reducedMotion = true;
    render(<CursorTrail />);
    sweep();
    advance(200);
    expect(getContextCalls).toBe(0);
    expect(rects).toBe(0);
  });

  it('ignores touch pointers even on a hybrid device', () => {
    render(<CursorTrail />);
    sweep(10, 'touch');
    advance(200);
    expect(getContextCalls).toBe(0);
  });

  it('stops immediately if reduced motion is switched on while running', () => {
    render(<CursorTrail />);
    sweep();
    advance(32);
    expect(frames.size).toBe(1);
    env.reducedMotion = true;
    fireMediaChange();
    expect(frames.size).toBe(0);
    rects = 0;
    sweep();
    advance(100);
    expect(rects).toBe(0);
  });

  it('removes every listener and animation frame on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CursorTrail />);
    sweep();
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(cancelled).toBeGreaterThanOrEqual(1);
    for (const type of ['pointermove', 'resize']) {
      const added = add.mock.calls.filter((c) => c[0] === type).length;
      const removed = remove.mock.calls.filter((c) => c[0] === type).length;
      expect(added, `${type} added`).toBeGreaterThan(0);
      expect(removed, `${type} removed`).toBe(added);
    }
    mqls.forEach((m) => expect(m.listeners.size).toBe(0));
    sweep();
    advance(100);
    expect(frames.size).toBe(0);
  });
});