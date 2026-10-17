export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Frequencies >= 530 are treated as AM kHz, everything else as FM MHz. */
export function formatFrequency(f: number): { value: string; unit: 'AM' | 'FM' } {
  return f >= 530 ? { value: String(Math.round(f)), unit: 'AM' } : { value: f.toFixed(1), unit: 'FM' };
}

export function frequencyLabel(f: number): string {
  const { value, unit } = formatFrequency(f);
  return `${unit} ${value}`;
}

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
