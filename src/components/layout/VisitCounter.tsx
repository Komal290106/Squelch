import { useEffect, useState } from 'react';

const KEY = 'squelch:visits';
const SESSION_KEY = 'squelch:visit-counted';
const MAX = 999_999;
// Only used when sessionStorage itself is unavailable, so one page load still counts once.
let countedInMemory = false;

/** Reads a stored count defensively: anything that is not a non-negative whole number becomes 0. */
export function parseVisits(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? Math.min(n, MAX) : 0;
}

function alreadyCounted(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return countedInMemory;
  }
}

function markCounted(): void {
  countedInMemory = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage unavailable: the in-memory flag is enough */
  }
}

/**
 * Counts one visit per browser session (reloads in the same tab do not add up).
 * Everything is wrapped so blocked, full or corrupted storage never breaks the page.
 */
export function recordVisit(): { count: number; saved: boolean } {
  let stored = 0;
  let readable = true;
  try {
    stored = parseVisits(window.localStorage.getItem(KEY));
  } catch {
    readable = false;
  }
  if (alreadyCounted()) return { count: Math.max(stored, 1), saved: readable };

  const count = Math.min(stored + 1, MAX);
  markCounted();
  let saved = readable;
  try {
    window.localStorage.setItem(KEY, String(count));
  } catch {
    saved = false;
  }
  return { count, saved };
}

/** A tiny old-web odometer. It counts visits from THIS browser only; it is not site analytics. */
export default function VisitCounter() {
  const [visit, setVisit] = useState<{ count: number; saved: boolean } | null>(null);
  useEffect(() => { setVisit(recordVisit()); }, []);

  const count = visit?.count ?? 0;
  const digits = String(count).padStart(6, '0').split('');

  return (
    <div
      className="inline-flex flex-col items-start gap-1.5 border-2 border-b-black/60 border-l-violet/60 border-r-black/60 border-t-violet/60 bg-console px-3 py-2"
      data-testid="visit-counter"
    >
      <span className="font-silk text-[10px] uppercase tracking-wider text-teal">You have tuned in</span>
      <span className="sr-only">{`${count} ${count === 1 ? 'time' : 'times'} from this browser`}</span>
      <span className={`flex items-center gap-1 transition-opacity ${visit ? 'opacity-100' : 'opacity-40'}`} aria-hidden>
        {digits.map((d, i) => (
          <span
            key={i}
            className="flex h-7 w-5 items-center justify-center border border-black/70 bg-void font-term text-xl leading-none text-amber shadow-[inset_0_0_6px_rgba(255,179,71,.25)]"
          >
            {d}
          </span>
        ))}
        <span className="ml-1 font-silk text-[10px] text-muted">times</span>
      </span>
      <span className="font-body text-[10px] text-muted/80">{visit && !visit.saved ? 'this visit only (storage is off)' : 'counted in this browser only'}</span>
    </div>
  );
}