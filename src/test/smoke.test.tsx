// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

beforeEach(() => {
  vi.useFakeTimers();
  window.scrollTo = vi.fn();
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
  class IO { observe() {} unobserve() {} disconnect() {} }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  (window.HTMLMediaElement.prototype as { play: () => Promise<void> }).play = () => Promise.resolve();
  (window.HTMLMediaElement.prototype as { pause: () => void }).pause = () => undefined;
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

async function tuneIn() {
  render(<App />);
  expect(screen.queryByText('Is anyone there?')).toBeNull(); // starts black
  tick(1500); tick(4000);                                    // typing + details
  tick(4000);
  fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
  tick(6000);
}

describe('Squelch site', () => {
  it('shows the intro, types the sentence, and reveals the site after tuning', async () => {
    await tuneIn();
    expect(screen.getByRole('heading', { level: 1, name: 'Squelch' })).toBeTruthy();
    expect(screen.queryByRole('dialog', { name: /incoming transmission/i })).toBeNull();
    for (const id of ['hero', 'station-id', 'story', 'archive', 'night-log', 'am-1717', 'footer']) {
      expect(document.getElementById(id), id).toBeTruthy();
    }
  });

  it('skip option works', () => {
    render(<App />);
    tick(1500); tick(500);
    fireEvent.click(screen.getByRole('button', { name: /skip transmission/i }));
    expect(screen.getByRole('button', { name: /tune the dial/i })).toBeTruthy();
  });

  it('beacon: wrong order resets, right order succeeds', async () => {
    await tuneIn();
    fireEvent.click(screen.getByRole('tab', { name: /beacon/i }));
    fireEvent.click(screen.getByRole('button', { name: /antenna coil/i }));
    expect(screen.getByRole('status').textContent).toMatch(/wrong order/i);
    for (const n of [/power fuse/i, /glass tube/i, /antenna coil/i]) fireEvent.click(screen.getByRole('button', { name: n }));
    expect(screen.getByRole('status').textContent).toMatch(/beacon online/i);
  });

  it('all three stations unlock AM 1717 and the reply works', async () => {
    await tuneIn();
    // lost & found
    for (const n of [/brass key/i, /one-rib umbrella/i, /reading glasses/i]) fireEvent.click(screen.getByRole('button', { name: n }));
    // beacon
    fireEvent.click(screen.getByRole('tab', { name: /beacon/i }));
    for (const n of [/power fuse/i, /glass tube/i, /antenna coil/i]) fireEvent.click(screen.getByRole('button', { name: n }));
    // weather
    fireEvent.click(screen.getByRole('tab', { name: /weather/i }));
    for (const n of [/^fog/i, /^rain/i, /^clear/i]) fireEvent.click(screen.getByRole('button', { name: n }));
    expect(screen.getByText(/all three stations logged/i)).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'AM 1717' }).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText(/message for squelch/i), { target: { value: 'Hello?' } });
    fireEvent.click(screen.getByRole('button', { name: /send on am 1717/i }));
    tick(5000);
    expect(document.body.textContent).toContain('A new listener. Good evening. Take your time.');
  });

  it('audio toggle flips state', async () => {
    await tuneIn();
    const btn = screen.getAllByRole('button', { name: /turn sound on/i })[0];
    fireEvent.click(btn);
    expect(screen.getAllByRole('button', { name: /mute sound/i }).length).toBeGreaterThan(0);
  });
});
