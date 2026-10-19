// @vitest-environment jsdom
//
// Intro audio: typing ticks and the quiet "searching" static.
//
// A fake <audio> records every play(), pause() and volume change, and like a real element it throws if a
// volume is ever set outside 0..1. Time advances in 50 ms steps so React renders between timers.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { setIntroGate, setSoundEnabled } from '../lib/audio';

interface PlayEvent { volume: number; rate: number }

class FakeAudio {
  static all: FakeAudio[] = [];
  src: string;
  preload = '';
  loop = false;
  currentTime = 0;
  playbackRate = 1;
  preservesPitch = true;
  paused = true;
  plays: PlayEvent[] = [];
  pauseCalls = 0;
  volumeLog: number[] = [];
  private v = 1;

  constructor(src: string) {
    this.src = src;
    FakeAudio.all.push(this);
  }
  get volume() { return this.v; }
  set volume(n: number) {
    if (n < 0 || n > 1) throw new RangeError(`volume ${n} out of range`);
    this.v = n;
    this.volumeLog.push(n);
  }
  play() {
    this.paused = false;
    this.plays.push({ volume: this.v, rate: this.playbackRate });
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.pauseCalls += 1;
  }
  reset() {
    this.paused = true;
    this.plays = [];
    this.pauseCalls = 0;
    this.volumeLog = [];
    this.v = 1;
    this.playbackRate = 1;
  }
}

const staticEl = () => FakeAudio.all.find((a) => a.src.includes('static-loop'));
const clickEls = () => FakeAudio.all.filter((a) => a.src.includes('dial-click'));
/** Typing ticks are the dial-click sample played faster than normal speed. */
const tickCount = () => clickEls().flatMap((a) => a.plays).filter((p) => p.rate > 1).length;
/** Number of static loops playing right now (must never exceed 1). */
const staticPlaying = () => FakeAudio.all.filter((a) => a.src.includes('static-loop') && !a.paused).length;

let reducedMotion = false;

beforeAll(() => { vi.stubGlobal('Audio', FakeAudio); });
afterAll(() => { vi.unstubAllGlobals(); });

beforeEach(() => {
  reducedMotion = false;
  FakeAudio.all.forEach((a) => a.reset());
  vi.useFakeTimers();
  window.scrollTo = vi.fn();
  window.matchMedia = ((q: string) => ({
    matches: reducedMotion && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  class IO { observe() {} unobserve() {} disconnect() {} }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
});

afterEach(() => {
  cleanup();
  setSoundEnabled(false);
  setIntroGate(false);
  vi.useRealTimers();
});

function run(ms: number, each?: () => void) {
  for (let t = 0; t < ms; t += 50) {
    act(() => { vi.advanceTimersByTime(50); });
    each?.();
  }
}

function runUntil(cond: () => boolean, limitMs: number, what: string) {
  for (let t = 0; t < limitMs; t += 50) {
    if (cond()) return;
    run(50);
  }
  expect(cond(), `timed out waiting for: ${what}`).toBe(true);
}

const introEl = () => document.querySelector('.intro-root');
const headline = () => document.querySelector('.intro-root p')?.textContent ?? '';
const statusLines = () => document.querySelectorAll('.intro-root ul li').length;
const dialVisible = () => screen.queryByRole('button', { name: /tune the dial/i })?.className.includes('opacity-100') ?? false;
const siteVisible = () => introEl() === null && screen.queryByRole('heading', { level: 1, name: 'Squelch' }) !== null;
const soundOn = () => fireEvent.click(screen.getAllByRole('button', { name: /turn sound on/i })[0]);
const mute = () => fireEvent.click(screen.getAllByRole('button', { name: /mute sound/i })[0]);

describe('intro audio', () => {
  it('is completely silent while sound is off (the default)', () => {
    render(<App />);
    runUntil(dialVisible, 12000, 'dial');
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    run(5000);
    expect(siteVisible()).toBe(true);
    expect(FakeAudio.all.flatMap((a) => a.plays)).toHaveLength(0);
  });

  it('natural path: soft ticks while typing, then a quiet static loop once the status lines appear', () => {
    render(<App />);
    soundOn();
    // Sound is on at the black opening screen, but nothing has been "found" yet: no static.
    expect(staticEl()?.plays.length ?? 0).toBe(0);

    runUntil(() => headline().startsWith('Is anyone there?'), 3000, 'typing to start');
    runUntil(() => statusLines() >= 1, 6000, 'first status line');

    // Ticks: some, but clearly fewer than one per letter ("Is anyone there?" has 16).
    const ticksWhileTyping = tickCount();
    expect(ticksWhileTyping).toBeGreaterThanOrEqual(4);
    expect(ticksWhileTyping).toBeLessThanOrEqual(9);
    clickEls().flatMap((a) => a.plays).filter((p) => p.rate > 1).forEach((p) => {
      expect(p.volume).toBeLessThanOrEqual(0.15); // soft, far below the 0.6 dial click
    });

    // Static starts as the status lines appear, from silence, at a very low level.
    const s = staticEl()!;
    expect(s.plays).toHaveLength(1);
    expect(s.loop).toBe(true);
    run(1500);
    expect(s.volume).toBeCloseTo(0.035, 3);
    expect(Math.max(...s.volumeLog)).toBeLessThanOrEqual(0.035 + 1e-9);

    // Typing sounds ended with the typing: no more ticks while the dial is shown.
    runUntil(dialVisible, 6000, 'dial');
    const finalTicks = tickCount();
    run(3000);
    expect(tickCount()).toBe(finalTicks);
    expect(staticPlaying()).toBe(1);
  });

  it('dial click: the static ramps up into the tuning ambient without restarting or spiking, then the site opens', () => {
    render(<App />);
    soundOn();
    runUntil(dialVisible, 12000, 'dial');
    run(1000);
    const s = staticEl()!;
    expect(s.plays).toHaveLength(1);
    const before = s.volumeLog.length;

    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    run(600);

    // Same loop: still one play(), never paused, never more than one static loop.
    expect(s.plays).toHaveLength(1);
    expect(s.pauseCalls).toBe(0);
    expect(staticPlaying()).toBe(1);
    // Smooth rise to the existing tuning level (0.12), in small steps.
    const ramp = s.volumeLog.slice(before);
    expect(ramp.length).toBeGreaterThan(3);
    expect(s.volume).toBeCloseTo(0.12, 3);
    for (let i = 1; i < ramp.length; i++) {
      expect(ramp[i]).toBeGreaterThanOrEqual(ramp[i - 1]);
      expect(ramp[i] - ramp[i - 1]).toBeLessThan(0.03);
    }
    // The existing dial click and tune-in effects still fire.
    expect(clickEls().flatMap((a) => a.plays).some((p) => p.rate === 1 && p.volume === 0.6)).toBe(true);

    run(6000);
    expect(siteVisible()).toBe(true);
    // Existing behaviour preserved: the ambient continues on the site, still a single loop; muting stops it.
    expect(staticPlaying()).toBe(1);
    mute();
    expect(staticPlaying()).toBe(0);
  });

  it('skip: typing ticks stop immediately; the dial then gets the same single quiet static', () => {
    render(<App />);
    soundOn();
    runUntil(() => tickCount() >= 2, 3000, 'a couple of ticks');
    const atSkip = tickCount();
    fireEvent.click(screen.getByRole('button', { name: /skip transmission/i }));
    run(4000); // the typewriter keeps finishing the sentence silently
    expect(tickCount()).toBe(atSkip);

    const s = staticEl()!;
    expect(s.plays).toHaveLength(1);
    expect(staticPlaying()).toBe(1);
    expect(s.volume).toBeCloseTo(0.035, 3);

    fireEvent.click(screen.getByRole('button', { name: /continue without tuning/i }));
    run(5000);
    expect(siteVisible()).toBe(true);
    expect(s.plays).toHaveLength(1);
    expect(s.pauseCalls).toBe(0);
    expect(staticPlaying()).toBe(1);
  });

  it('mute stops ticks and static at once; unmuting resumes the static at the quiet searching level', () => {
    render(<App />);
    soundOn();
    runUntil(() => tickCount() >= 2, 3000, 'ticks');
    mute();
    const frozen = tickCount();
    run(1200);
    expect(tickCount()).toBe(frozen);

    // Muted all the way to the dial: nothing plays.
    runUntil(dialVisible, 10000, 'dial');
    expect(staticPlaying()).toBe(0);
    expect(staticEl()?.plays.length ?? 0).toBe(0);

    // Unmute on the dial screen: static begins, quietly, as the one and only loop.
    soundOn();
    run(1500);
    expect(staticPlaying()).toBe(1);
    expect(staticEl()!.volume).toBeCloseTo(0.035, 3);

    // Mute again, unmute again: still exactly one loop at the same level.
    mute();
    expect(staticPlaying()).toBe(0);
    soundOn();
    run(1500);
    expect(staticPlaying()).toBe(1);
    expect(staticEl()!.volume).toBeCloseTo(0.035, 3);
  });

  it('turning sound on at the black opening screen does not start static early', () => {
    render(<App />);
    soundOn();
    run(900);
    expect(introEl()).not.toBeNull();
    expect(staticEl()?.plays.length ?? 0).toBe(0);
  });

  it('reduced motion: the sentence appears at once (no ticks), the static still starts, nothing is slower', () => {
    reducedMotion = true;
    render(<App />);
    soundOn();
    run(400);
    expect(headline().startsWith('Is anyone there?')).toBe(true);
    runUntil(dialVisible, 4000, 'dial');
    expect(tickCount()).toBe(0);
    expect(staticPlaying()).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    run(4000);
    expect(siteVisible()).toBe(true);
  });

  it('cleanup: unmounting the intro mid-search stops the static, the ticks and every timer', () => {
    const { unmount } = render(<App />);
    soundOn();
    runUntil(() => statusLines() >= 1, 6000, 'searching');
    expect(staticPlaying()).toBe(1);
    unmount();
    expect(staticPlaying()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    const ticks = tickCount();
    run(3000);
    expect(tickCount()).toBe(ticks);
  });
});