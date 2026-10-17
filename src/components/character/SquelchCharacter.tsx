import { useEffect, useRef, useState } from 'react';
import type { Mood } from '../../data/stations';
import { cn } from '../../lib/utils';

const ALT: Record<Mood, string> = {
  idle: 'Squelch, a small violet vintage radio with two knob eyes and a teal speaker mouth, resting.',
  listening: 'Squelch leaning in to listen, its knob eyes turned toward the sound.',
  signal: 'Squelch with glowing green eyes, a signal detected above its antenna.',
  surprised: 'Squelch wide-eyed and startled, its speaker mouth round.',
  sleepy: 'Squelch with half-closed eyes and a drooping antenna, drifting off.',
  happy: 'Squelch smiling with happy arc-shaped eyes, connected.',
};

interface Props {
  mood?: Mood;
  className?: string;
  /** If true, hover → listening, click → surprised for a moment. */
  interactive?: boolean;
  bob?: boolean;
  onPoke?: () => void;
}

export default function SquelchCharacter({ mood = 'idle', className, interactive = false, bob = true, onPoke }: Props) {
  const [temp, setTemp] = useState<Mood | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const current = temp ?? mood;
  const poke = () => {
    setTemp('surprised');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTemp(null), 1200);
    onPoke?.();
  };

  const img = (
    <img
      src={`/assets/characters/squelch-${current}.svg`}
      alt={ALT[current]}
      draggable={false}
      className={cn('pixelated block h-full w-full select-none object-contain', bob && 'anim-bob')}
    />
  );

  if (!interactive) return <div className={className}>{img}</div>;
  return (
    <button
      type="button"
      className={cn('block rounded-none border-0 bg-transparent p-0', className)}
      aria-label="Poke Squelch"
      onClick={poke}
      onMouseEnter={() => !temp && setTemp('listening')}
      onMouseLeave={() => temp === 'listening' && setTemp(null)}
      onFocus={() => !temp && setTemp('listening')}
      onBlur={() => temp === 'listening' && setTemp(null)}
    >
      {img}
    </button>
  );
}
