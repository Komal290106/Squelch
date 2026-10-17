import { useState } from 'react';
import { Glasses, Key, Lamp, Mail, Umbrella, Watch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LOST_FOUND_GOAL, lostItems } from '../../data/stations';
import { useRadio } from '../../hooks/useRadioState';
import { playSfx } from '../../lib/audio';
import { cn } from '../../lib/utils';
import TypewriterText from '../intro/TypewriterText';

const ICONS: Record<string, LucideIcon> = { Key, Umbrella, Glasses, Mail, Watch, Lamp };

export default function LostAndFound() {
  const { lostOpened, openLostItem, discovered } = useRadio();
  const [active, setActive] = useState<string | null>(null);
  const item = lostItems.find((i) => i.id === active);
  const stable = discovered.includes('lost-found');

  return (
    <div>
      <p className="text-sm text-muted">
        The shelf behind the microphone. Each object has a tag, and each tag has a story. Pick one up.
        <span className="ml-1 text-teal">{Math.min(lostOpened.length, LOST_FOUND_GOAL)}/{LOST_FOUND_GOAL} heard{stable ? ', signal stable' : ''}.</span>
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {lostItems.map((it) => {
          const Icon = ICONS[it.icon];
          const opened = lostOpened.includes(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={active === it.id}
                onClick={() => { setActive(it.id); openLostItem(it.id); playSfx('dialClick', 0.4); }}
                className={cn('btn-radio !flex-col !items-start !gap-2 w-full !p-3 text-left', opened && '!border-amber/50')}
              >
                <Icon size={26} className={opened ? 'text-amber' : 'text-cream'} aria-hidden />
                <span className="font-body text-[13px] normal-case text-cream">{it.name}</span>
                <span className="font-body text-[11px] normal-case text-muted">{it.tag}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 min-h-[7rem] border border-dashed border-white/10 p-4" aria-live="polite">
        {item ? (
          <>
            <p className="font-silk text-[11px] text-amber">Transmission · {item.name}</p>
            <p className="mt-3 font-term text-2xl leading-snug text-cream"><TypewriterText key={item.id} text={item.story} speed={22} cursor={false} /></p>
          </>
        ) : (
          <p className="text-sm text-muted/70">Nothing picked up yet.</p>
        )}
      </div>
    </div>
  );
}
