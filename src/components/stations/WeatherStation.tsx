import { useMemo } from 'react';
import { CloudFog, CloudRain, MoonStar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { weatherModes } from '../../data/stations';
import type { Weather } from '../../data/stations';
import { useRadio } from '../../hooks/useRadioState';
import { playSfx } from '../../lib/audio';
import { cn } from '../../lib/utils';
import TypewriterText from '../intro/TypewriterText';
import SquelchCharacter from '../character/SquelchCharacter';

const ICONS: Record<Weather, LucideIcon> = { fog: CloudFog, rain: CloudRain, clear: MoonStar };
const TINT: Record<Weather, string> = {
  fog: 'brightness-[.6] saturate-50',
  rain: 'brightness-[.5] saturate-75 hue-rotate-[10deg]',
  clear: 'brightness-[1.05]',
};

export default function WeatherStation() {
  const { weather, setWeather, weatherSeen } = useRadio();
  const mode = weatherModes.find((m) => m.id === weather)!;
  const stars = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 45, d: (i % 7) * 0.4 })), []);

  return (
    <div>
      <p className="text-sm text-muted">
        Tell Squelch what the sky is doing. It reports whatever you choose, with total confidence.
        <span className="ml-1 text-teal">{weatherSeen.length}/3 forecasts heard.</span>
      </p>
      <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Choose the weather">
        {weatherModes.map((m) => {
          const Icon = ICONS[m.id];
          return (
            <button key={m.id} type="button" aria-pressed={weather === m.id} className="btn-radio"
              onClick={() => { setWeather(m.id); playSfx('dialClick', 0.4); }}>
              <Icon size={16} aria-hidden /> {m.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 aspect-[16/9] overflow-hidden border border-white/10 bg-void" data-weather={weather}>
        <img src="/assets/backgrounds/lowtide-hollow.svg" alt={`Lowtide Hollow in ${mode.label.toLowerCase()} weather.`} className={cn('pixelated h-full w-full object-cover transition-[filter] duration-1000', TINT[weather])} />
        {weather === 'fog' && <div className="wx-fog" aria-hidden />}
        {weather === 'rain' && <><div className="wx-rain" aria-hidden /><div className="absolute inset-0 bg-[#10162e]/40" aria-hidden /></>}
        {weather === 'clear' && stars.map((s, i) => <span key={i} className="wx-star" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }} aria-hidden />)}
        <SquelchCharacter mood={mode.mood} bob={false} className="absolute bottom-2 right-2 h-20 w-20 sm:h-28 sm:w-28" />
      </div>

      <p className="mt-5 min-h-[5.5rem] font-term text-2xl leading-snug text-cream" aria-live="polite">
        <TypewriterText key={weather} text={mode.message} speed={20} cursor={false} />
      </p>
    </div>
  );
}
