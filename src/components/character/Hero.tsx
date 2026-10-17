import { ChevronsDown } from 'lucide-react';
import { character } from '../../data/character';
import { useRadio } from '../../hooks/useRadioState';
import { formatFrequency } from '../../lib/utils';
import SignalIndicator from '../ui/SignalIndicator';
import SquelchCharacter from './SquelchCharacter';

export default function Hero() {
  const { frequency, mood } = useRadio();
  const f = formatFrequency(frequency);
  return (
    <section id="hero" data-frequency="88.1" className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-24 sm:px-10">
      <img src="/assets/backgrounds/lowtide-hollow.svg" alt="" aria-hidden className="pixelated absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/40 to-void/70" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="relative mx-auto aspect-square w-[min(78vw,430px)] md:order-2">
          <div className="absolute inset-x-[8%] bottom-[2%] h-[14%] rounded-[50%] bg-black/70 blur-md" aria-hidden />
          <div className="absolute left-1/2 top-[30%] h-[55%] w-[80%] -translate-x-1/2 rounded-full bg-amber/10 blur-3xl anim-glow" aria-hidden />
          <SquelchCharacter mood={mood} interactive className="relative h-full w-full" />
        </div>

        <div className="md:order-1">
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <span className="on-air"><i aria-hidden /> ON AIR</span>
            <span className="flex items-center gap-3" aria-live="polite">
              <span className="led-readout text-3xl">{f.value}</span>
              <span className="font-silk text-[11px] text-muted">{f.unit}</span>
              <SignalIndicator level={4} />
            </span>
          </div>
          <h1 className="text-6xl text-cream sm:text-7xl">{character.name}</h1>
          <p className="mt-2 font-term text-2xl text-teal sm:text-3xl">{character.role}</p>
          <p className="mt-6 max-w-[34rem] text-[15px] text-muted">{character.intro}</p>
          <p className="mt-6 font-pixel text-xl text-amber sm:text-2xl">“{character.tagline}”</p>
          <p className="mt-2 text-xs text-muted/70">Poke Squelch. It is a little shy, but it likes the attention.</p>
        </div>
      </div>

      <a href="#station-id" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted hover:text-cream" aria-label="Scroll to the station record">
        <span className="font-silk text-[10px]">Scroll down the dial</span>
        <ChevronsDown size={18} className="anim-bob" aria-hidden />
      </a>
    </section>
  );
}
