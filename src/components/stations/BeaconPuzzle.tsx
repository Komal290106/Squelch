import { Disc3, Lightbulb, RadioTower, RotateCcw, Speaker, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { beaconClue, beaconParts, beaconSolution } from '../../data/stations';
import { useRadio } from '../../hooks/useRadioState';
import { playSfx } from '../../lib/audio';
import { cn } from '../../lib/utils';
import SignalIndicator from '../ui/SignalIndicator';
import SquelchCharacter from '../character/SquelchCharacter';

const ICONS: Record<string, LucideIcon> = { Zap, Lightbulb, RadioTower, Disc3, Speaker };

export default function BeaconPuzzle() {
  const { beaconProgress, beaconMessage, pressBeaconPart, resetBeacon, discovered } = useRadio();
  const solved = discovered.includes('beacon');
  const step = beaconProgress.length;
  const failed = beaconMessage.startsWith('Static');

  return (
    <div>
      <p className="text-sm text-muted">{beaconClue}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-white/10 p-3">
        <div className="flex items-center gap-3" aria-label={`Repair progress: ${step} of ${beaconSolution.length}`} role="img">
          {beaconSolution.map((_, i) => (
            <span key={i} className={cn('h-3 w-3 rounded-full border', i < step ? 'border-phosphor bg-phosphor shadow-[0_0_8px_#7CFFB2]' : 'border-muted/40')} />
          ))}
        </div>
        <SignalIndicator level={solved ? 5 : step * 1 + (step ? 1 : 0)} tone={failed ? 'red' : 'green'} label="Beacon signal" />
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {beaconParts.map((p) => {
          const Icon = ICONS[p.icon];
          const done = beaconProgress.includes(p.id);
          return (
            <li key={p.id}>
              <button type="button" disabled={solved} aria-pressed={done}
                onClick={() => { pressBeaconPart(p.id); playSfx('dialClick', 0.4); }}
                className="btn-radio w-full !flex-col !gap-2 !p-3 disabled:opacity-70">
                <Icon size={24} className={done ? 'text-phosphor' : 'text-cream'} aria-hidden />
                <span className="font-body text-[12px] normal-case">{p.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center gap-4">
        <SquelchCharacter mood={solved ? 'happy' : failed ? 'surprised' : step ? 'signal' : 'listening'} bob={false} className="h-20 w-20 shrink-0" />
        <p role="status" className={cn('font-term text-2xl leading-snug', solved ? 'glow-green' : failed ? 'text-signal' : 'text-cream')}>{beaconMessage}</p>
      </div>
      {(solved || step > 0) && (
        <button type="button" onClick={resetBeacon} className="btn-radio mt-4"><RotateCcw size={14} aria-hidden /> Reset board</button>
      )}
    </div>
  );
}
