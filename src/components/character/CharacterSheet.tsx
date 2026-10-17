import { character } from '../../data/character';
import TerminalPanel from '../ui/TerminalPanel';
import SquelchCharacter from './SquelchCharacter';

export default function CharacterSheet() {
  return (
    <section id="station-id" data-frequency="88.7" className="px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-4xl text-cream sm:text-5xl">Station record found</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">
          A card from the Dead Air FM filing cabinet, still warm. The operator filled it in by hand, then added a note at the bottom.
        </p>

        <TerminalPanel title="DEAD AIR FM · OPERATOR RECORD 0001" status="STATUS: ACTIVE" tone="teal" className="mt-10">
          <div className="relative grid gap-8 md:grid-cols-[220px_1fr]">
            <div className="relative mx-auto w-44 md:w-full">
              <SquelchCharacter mood="listening" bob={false} className="aspect-square w-full" />
              <span className="stamp -right-2 top-1" aria-hidden>ON DUTY</span>
            </div>
            <dl className="space-y-3">
              {character.record.map((r) => (
                <div key={r.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline">
                  <dt className="shrink-0 font-silk text-[11px] text-teal sm:w-20">{r.label}</dt>
                  <span className="dotted-leader hidden sm:block" aria-hidden />
                  <dd className="text-[15px] text-cream sm:w-[62%]">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-8 border-t border-white/5 pt-5">
            <p className="font-silk text-[11px] text-muted">Notes on temperament</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {character.personality.map((p) => (
                <li key={p} className="flex gap-3"><span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-amber" aria-hidden />{p}</li>
              ))}
            </ul>
          </div>
        </TerminalPanel>
      </div>
    </section>
  );
}
