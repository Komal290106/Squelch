import { useState } from 'react';
import { Play } from 'lucide-react';
import { finalRecording, scenes } from '../../data/story';
import type { StoryScene } from '../../data/story';
import { useSeen } from '../../hooks/useInView';
import { playSfx } from '../../lib/audio';
import { cn } from '../../lib/utils';
import TypewriterText from '../intro/TypewriterText';
import SquelchCharacter from '../character/SquelchCharacter';

function Scene({ scene, last }: { scene: StoryScene; last: boolean }) {
  const [ref, seen] = useSeen<HTMLElement>(0.3);
  const [playing, setPlaying] = useState(0);

  return (
    <article ref={ref} className="relative isolate flex min-h-[85svh] items-end overflow-hidden border-t border-white/5" aria-labelledby={`${scene.id}-t`}>
      <img src={scene.image} alt={scene.alt} loading="lazy" className="pixelated absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/55 to-transparent" />
      <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-40 sm:px-10">
        <p className={cn('log-line font-silk text-[11px] text-teal')} data-seen={seen}>{scene.marker}</p>
        <h3 id={`${scene.id}-t`} className="log-line mt-3 text-3xl text-cream sm:text-5xl" data-seen={seen}>{scene.title}</h3>
        <div className="mt-6 max-w-xl space-y-4">
          {scene.passages.map((p, i) => (
            <p key={p} className="log-line text-[15px] text-cream/90" data-seen={seen} style={{ transitionDelay: `${0.5 + i * 0.9}s` }}>{p}</p>
          ))}
        </div>

        {last && (
          <div className="mt-8 max-w-xl">
            <div className="panel p-4" data-tone="amber">
              <div className="flex items-center justify-between gap-3">
                <p className="font-silk text-[11px] text-amber">Tape recorder · last message</p>
                <button type="button" className="btn-radio" onClick={() => { playSfx('dialClick'); setPlaying((n) => n + 1); }}>
                  <Play size={14} aria-hidden /> {playing ? 'Replay recording' : 'Play recording'}
                </button>
              </div>
              <p className="mt-4 min-h-[3.2em] font-term text-2xl text-amber sm:text-3xl" aria-live="polite">
                {playing ? <TypewriterText key={playing} text={`“${finalRecording}”`} speed={55} /> : <span className="text-muted/60">Tape is rewound. Nothing playing.</span>}
              </p>
            </div>
            <SquelchCharacter mood={playing ? 'listening' : 'sleepy'} className="mt-6 h-24 w-24" />
          </div>
        )}
      </div>
    </article>
  );
}

export default function StorySection() {
  return (
    <section id="story" data-frequency="90.3" className="pt-24">
      <div className="mx-auto max-w-5xl px-5 pb-12 sm:px-10">
        <h2 className="text-4xl text-cream sm:text-5xl">Lowtide Hollow</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">Four tapes from the archive. Scroll slowly. They were recorded for someone who had time.</p>
      </div>
      {scenes.map((s, i) => <Scene key={s.id} scene={s} last={i === scenes.length - 1} />)}
    </section>
  );
}
