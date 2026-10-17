import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import { stations } from '../../data/stations';
import type { StationId } from '../../data/stations';
import { useRadio } from '../../hooks/useRadioState';
import { playSfx } from '../../lib/audio';
import { cn, formatFrequency } from '../../lib/utils';
import TerminalPanel from '../ui/TerminalPanel';
import BeaconPuzzle from './BeaconPuzzle';
import LostAndFound from './LostAndFound';
import WeatherStation from './WeatherStation';

export default function FrequencyArchive() {
  const { discovered, setFrequency, secretUnlocked } = useRadio();
  const [selected, setSelected] = useState<StationId>('lost-found');
  const station = stations.find((s) => s.id === selected)!;

  const tune = (id: StationId) => {
    const s = stations.find((x) => x.id === id)!;
    setSelected(id);
    setFrequency(s.frequency);
    playSfx('dialClick', 0.5);
  };

  const onKey = (e: KeyboardEvent) => {
    const i = stations.findIndex((s) => s.id === selected);
    if (e.key === 'ArrowRight') { e.preventDefault(); tune(stations[(i + 1) % stations.length].id); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); tune(stations[(i - 1 + stations.length) % stations.length].id); }
  };

  // dial strip: 88 → 108, map each station to a % position
  const pos = (f: number) => ((f - 88) / 20) * 100;

  return (
    <section id="archive" data-frequency="92.1" className="px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-4xl text-cream sm:text-5xl">Frequency archive</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">Three stations still carry a signal. Tune to one. Hear all three and something else may answer.</p>

        {/* tuning strip */}
        <div className="relative mt-10 h-24 border-y border-white/10" aria-hidden>
          <div className="absolute inset-x-0 top-8 flex justify-between px-1 text-[10px] text-muted/70">
            {[88, 92, 96, 100, 104, 108].map((n) => <span key={n}>{n}</span>)}
          </div>
          <div className="absolute inset-x-0 top-3 h-2 bg-[repeating-linear-gradient(90deg,rgba(154,163,196,.4)_0_1px,transparent_1px_14px)]" />
          {stations.map((s) => (
            <span key={s.id} className={cn('absolute top-2 h-4 w-1 transition-colors', discovered.includes(s.id) ? 'bg-phosphor shadow-[0_0_8px_#7CFFB2]' : 'bg-muted/50')} style={{ left: `${pos(s.frequency)}%` }} />
          ))}
          <span className="absolute top-0 h-full w-[2px] bg-signal shadow-[0_0_10px_#FF3B3B] transition-[left] duration-700" style={{ left: `${pos(station.frequency)}%` }} />
        </div>

        <div role="tablist" aria-label="Stations" onKeyDown={onKey} className="mt-6 grid gap-3 sm:grid-cols-3">
          {stations.map((s) => {
            const f = formatFrequency(s.frequency);
            const done = discovered.includes(s.id);
            return (
              <button key={s.id} role="tab" id={`tab-${s.id}`} aria-selected={selected === s.id} aria-controls="station-panel" tabIndex={selected === s.id ? 0 : -1}
                onClick={() => tune(s.id)} className="btn-radio !flex-col !items-start !gap-1 !p-4 text-left">
                <span className="flex w-full items-center justify-between">
                  <span className="led-readout text-3xl">{f.value}<span className="ml-1 text-base">{f.unit}</span></span>
                  {done && <Check size={16} className="text-phosphor" aria-label="Station logged" />}
                </span>
                <span className="font-pixel text-lg normal-case text-cream">{s.title}</span>
                <span className="font-body text-[12px] normal-case text-muted">{s.blurb}</span>
              </button>
            );
          })}
        </div>

        <div id="station-panel" role="tabpanel" aria-labelledby={`tab-${selected}`} className="mt-6">
          <TerminalPanel title={`${formatFrequency(station.frequency).unit} ${formatFrequency(station.frequency).value} · ${station.title}`} status={discovered.includes(station.id) ? 'SIGNAL LOGGED' : 'TUNED'} tone={discovered.includes(station.id) ? 'teal' : 'violet'}>
            <p className="mb-5 font-silk text-[11px] text-amber">Goal: {station.goal}</p>
            {selected === 'lost-found' && <LostAndFound />}
            {selected === 'beacon' && <BeaconPuzzle />}
            {selected === 'weather' && <WeatherStation />}
          </TerminalPanel>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {secretUnlocked
            ? 'All three stations logged. Something is carrying on a frequency you can’t find on the dial. Check the nav.'
            : `${discovered.length} of 3 stations logged.`}
        </p>
      </div>
    </section>
  );
}
