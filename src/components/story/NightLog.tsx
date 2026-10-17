import { nightLog } from '../../data/story';
import type { LogEntry } from '../../data/story';
import { useSeen } from '../../hooks/useInView';
import { cn } from '../../lib/utils';
import SignalIndicator from '../ui/SignalIndicator';
import TerminalPanel from '../ui/TerminalPanel';

function Entry({ e }: { e: LogEntry }) {
  const [ref, seen] = useSeen<HTMLLIElement>(0.6);
  return (
    <li ref={ref} data-seen={seen} className={cn('log-line grid grid-cols-[4rem_1fr] gap-x-4 gap-y-1 border-l-2 py-3 pl-4 sm:grid-cols-[4.5rem_6rem_1fr]', e.clue ? 'border-amber' : 'border-white/10')}>
      <time className="font-term text-xl text-phosphor">{e.time}</time>
      <span className="order-last col-span-2 sm:order-none sm:col-span-1"><SignalIndicator level={e.signal} tone={e.clue ? 'amber' : 'green'} label="Signal report" className="scale-75 origin-left" /></span>
      <p className={cn('text-[15px]', e.clue ? 'glow-amber' : 'text-cream/90')}>{e.text}</p>
    </li>
  );
}

export default function NightLog() {
  return (
    <section id="night-log" data-frequency="98.9" className="px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl text-cream sm:text-5xl">Night log</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">Squelch writes this every night. Read it in order; it only makes sense that way.</p>
        <TerminalPanel title="DEAD AIR FM · OPERATOR LOG" status="SHIFT 22:00–05:30" tone="teal" className="mt-10">
          <ol className="space-y-1">
            {nightLog.map((e) => <Entry key={e.time} e={e} />)}
          </ol>
        </TerminalPanel>
      </div>
    </section>
  );
}
