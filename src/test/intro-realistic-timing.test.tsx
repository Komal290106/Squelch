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

// Realistic: advance 50ms at a time so React re-renders between timer firings (like a browser).
const run = (ms: number) => { for (let t = 0; t < ms; t += 50) act(() => { vi.advanceTimersByTime(50); }); };

describe('real-browser timing', () => {
  it('intro finishes after clicking the dial', () => {
    render(<App />);
    run(9000);
    fireEvent.click(screen.getByRole('button', { name: /tune the dial/i }));
    const log: string[] = [];
    for (let i = 0; i < 12; i++) { run(500); log.push((document.querySelector('.intro-root p') as HTMLElement | null)?.textContent ?? '(intro gone)'); }
    console.log('INTRO HEADLINE EVERY 0.5s AFTER CLICK:\n' + log.join('\n'));
    expect(document.querySelector('.intro-root')).toBeNull();
  });
});
