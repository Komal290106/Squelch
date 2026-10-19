// @vitest-environment jsdom
//
// Regression tests for the opening transmission.
//
// These tests deliberately advance fake time in SMALL steps (50 ms) and let React render between
// steps, the way a real browser does. Coarse jumps such as `advanceTimersByTime(6000)` fire every
// timer before React re-renders, which hides bugs where a state update makes an effect re-run and
// clear the intro's timers (the original "it keeps going back to 'Is anyone there?'" bug).
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
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
  (window.HTMLMediaElement.prototype as { play: () => Promise<void> }).play = () => Promise.resolve();
  (window.HTMLMediaElement.prototype as { pause: () => void }).pause = () => undefined;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/** Advance fake time in 50 ms steps, calling `each` after every step. */
function run(ms: number, each?: () => void) {
  for (let t = 0; t < ms; t += 50) {
    act(() => { vi.advanceTimersByTime(50); });
    each?.();
  }
}

const introEl = () => document.querySelector('.intro-root');
const headline = () => document.querySelector('.intro-root p')?.textContent ?? '';
const statusLines = () => document.querySelectorAll('.intro-root ul li').length;
const dialVisible = () => screen.queryByRole('button', { name: /tune the dial/i })?.className.includes('opacity-100') ?? false;
const siteVisible = () => introEl() === null && screen.queryByRole('heading', { level: 1, name: 'Squelch' }) !== null;

/** Run until `cond()` is true, or fail after `limitMs` of fake time. */
function runUntil(cond: () => boolean, limitMs: number, what: string) {
  for (let t = 0; t < limitMs; t += 50) {
    if (cond()) return;
    run(50);
  }
  expect(cond(), `timed out waiting for: ${what}`).toBe(true);
}

describe('intro transmission (real-browser timing)', () => {
  it('starts on a blank screen, then types "Is anyone there?", then shows 3 status lines and the dial by itself', () => {
    render(<App />);
    expect(introEl()).not.toBeNull();
    expect(headline()).toBe('');
    expect(statusLines()).toBe(0);

    runUntil(() => headline().startsWith('Is anyone there?'), 3000, 'headline to start');
    runUntil(() => statusLines() === 3, 8000, 'three status lines');
    runUntil(dialVisible, 8000, 'dial to fade in');
    // Nothing was clicked, and the intro is still waiting on the dial.
    expect(introEl()).not.toBeNull();
    expect(headline().startsWith('Is anyone there?')).toBe(true);
  });

  it('clicking the dial finishes tuning and reveals the site, without ever restarting the intro', () => {
    render(<App />);
    runUntil(dialVisible, 12000, 'dial to appear');
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));

    let connected = false;
    let restartedAfterConnect = false;
    run(8000, () => {
      if (headline().startsWith('There you are.')) connected = true;
      // Once "There you are." has been shown, the original bug flipped back to "Is anyone there?".
      if (connected && headline().startsWith('Is anyone there?')) restartedAfterConnect = true;
    });

    expect(connected).toBe(true);
    expect(restartedAfterConnect).toBe(false);
    expect(siteVisible()).toBe(true);
  });

  it('survives an unrelated state change (sound toggle) in the middle of tuning', () => {
    render(<App />);
    runUntil(dialVisible, 12000, 'dial to appear');
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    run(600); // mid-tune
    // Any dispatch used to recreate every action function, re-run the opening effect and clear the timers.
    fireEvent.click(screen.getAllByRole('button', { name: /turn sound on/i })[0]);
    run(8000);
    expect(siteVisible()).toBe(true);
  });

  it('"Skip transmission" jumps to the dial and the status lines stay complete (no replay)', () => {
    render(<App />);
    runUntil(() => headline().startsWith('Is anyone there?'), 3000, 'headline to start');
    fireEvent.click(screen.getByRole('button', { name: /skip transmission/i }));
    expect(statusLines()).toBe(3);

    // The typewriter is still mounted after a skip and finishes later; that must not replay the status lines.
    let minLines = 3;
    run(5000, () => { minLines = Math.min(minLines, statusLines()); });
    expect(minLines).toBe(3);
    expect(dialVisible()).toBe(true);
  });

  it('"Continue without tuning" reveals the site, including right after a skip', () => {
    render(<App />);
    runUntil(() => headline().startsWith('Is anyone there?'), 3000, 'headline to start');
    fireEvent.click(screen.getByRole('button', { name: /skip transmission/i }));
    run(2500); // the stale typewriter callback used to fire inside this window
    fireEvent.click(screen.getByRole('button', { name: /continue without tuning/i }));
    expect(statusLines()).toBe(3);
    run(4000);
    expect(siteVisible()).toBe(true);
  });

  it('"Continue without tuning" also works when reached naturally', () => {
    render(<App />);
    runUntil(() => screen.queryByRole('button', { name: /continue without tuning/i }) !== null, 12000, 'continue button');
    fireEvent.click(screen.getByRole('button', { name: /continue without tuning/i }));
    run(4000);
    expect(siteVisible()).toBe(true);
  });

  it('respects prefers-reduced-motion: faster sequence, and both paths still reveal the site', () => {
    reducedMotion = true;
    const { unmount } = render(<App />);
    // Reduced motion starts the sentence after ~200 ms instead of ~1400 ms and shows it instantly.
    run(400);
    expect(headline().startsWith('Is anyone there?')).toBe(true);
    runUntil(dialVisible, 4000, 'dial to appear (reduced motion)');
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    run(4000);
    expect(siteVisible()).toBe(true);
    unmount();
    cleanup();

    render(<App />);
    run(400);
    fireEvent.click(screen.getByRole('button', { name: /skip transmission/i }));
    run(300);
    fireEvent.click(screen.getByRole('button', { name: /continue without tuning/i }));
    run(3000);
    expect(siteVisible()).toBe(true);
  });
});