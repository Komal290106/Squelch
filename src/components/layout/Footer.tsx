import { useState } from 'react';
import { useRadio } from '../../hooks/useRadioState';
import { frequencyLabel } from '../../lib/utils';

export default function Footer() {
  const { frequency, secretUnlocked, forceSecret, discovered } = useRadio();
  const [taps, setTaps] = useState(0);
  const tap = () => {
    const n = taps + 1;
    setTaps(n);
    if (n >= 5 && !secretUnlocked) forceSecret();
  };

  return (
    <footer id="footer" data-frequency="88.1" className="border-t border-white/5 px-5 pb-16 pt-14 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-pixel text-2xl text-cream">Dead Air FM</p>
          <p className="mt-2 text-sm text-muted">Broadcasting from Lowtide Hollow. Operator on duty: Squelch.</p>
        </div>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-3"><dt className="w-24 text-muted">Tuned to</dt><dd className="led-readout text-xl">{frequencyLabel(frequency)}</dd></div>
          <div className="flex gap-3"><dt className="w-24 text-muted">Status</dt><dd className="text-phosphor">Transmitting</dd></div>
          <div className="flex gap-3"><dt className="w-24 text-muted">Program</dt><dd className="text-cream">The Recording (repeat)</dd></div>
          <div className="flex gap-3"><dt className="w-24 text-muted">Logged</dt><dd className="text-cream">{discovered.length}/3 stations</dd></div>
        </dl>
        <div className="text-xs text-muted">
          <p>Pixel art, sounds and code made for the haX.baby “Baby’s First Website” hackathon.</p>
          <p className="mt-2">Fonts: Pixelify Sans, Silkscreen, VT323, Space Mono (SIL OFL). See ASSET_CREDITS.md.</p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-5xl items-center justify-between gap-4">
        <p className="font-term text-2xl text-amber">Thank you for staying on the frequency.</p>
        <button type="button" onClick={tap} aria-label="Pilot lamp" className="flex h-11 w-11 items-center justify-center">
          <span className={`h-2 w-2 rounded-full bg-amber ${taps ? 'anim-lamp' : 'opacity-40'}`} />
        </button>
      </div>
      {taps > 0 && taps < 5 && !secretUnlocked && <p className="mx-auto mt-2 max-w-5xl text-right text-[11px] text-muted/60" aria-live="polite">The lamp flickers back. ({taps}/5)</p>}
      {taps >= 5 && secretUnlocked && <p className="mx-auto mt-2 max-w-5xl text-right text-[11px] text-amber" aria-live="polite">Somewhere on the dial, a carrier wakes up. AM 1717.</p>}
    </footer>
  );
}
