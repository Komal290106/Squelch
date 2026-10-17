import { cn } from '../../lib/utils';

interface Props {
  visible: boolean;
  tuning: boolean;
  tuned: boolean;
  onActivate: () => void;
}

const TICKS = Array.from({ length: 41 }, (_, i) => i);

/** A vintage dial. The whole thing is one big accessible button. */
export default function FrequencyDial({ visible, tuning, tuned, onActivate }: Props) {
  const busy = tuning || tuned;
  return (
    <button
      type="button"
      onClick={onActivate}
      disabled={busy}
      aria-label="Tune the dial to find the signal"
      className={cn('dial-btn transition-opacity duration-[2500ms]', visible ? 'opacity-100' : 'pointer-events-none opacity-0')}
      style={{ width: 'min(64vw, 280px)', height: 'min(64vw, 280px)' }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden>
        {/* housing */}
        <circle cx="100" cy="100" r="97" fill="#271F42" />
        <circle cx="100" cy="100" r="93" fill="#5B4B8A" />
        <circle cx="100" cy="100" r="86" fill="#3A2F5E" />
        <circle cx="100" cy="100" r="80" fill="#E8DFC8" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#B9AE92" strokeWidth="1.5" />
        {/* scale */}
        {TICKS.map((i) => {
          const a = (-130 + (i * 260) / 40) * (Math.PI / 180);
          const major = i % 5 === 0;
          const r1 = 76, r2 = major ? 64 : 70;
          return (
            <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * r2} y2={100 - Math.cos(a) * r2}
              stroke="#271F42" strokeWidth={major ? 2 : 1} />
          );
        })}
        {[88, 92, 96, 100, 104, 108].map((n, i) => {
          const a = (-130 + (i * 260) / 5) * (Math.PI / 180);
          return (
            <text key={n} x={100 + Math.sin(a) * 52} y={100 - Math.cos(a) * 52 + 3} textAnchor="middle" fontSize="9" fill="#271F42" fontFamily="'Space Mono', monospace" fontWeight="700">{n}</text>
          );
        })}
        <text x="100" y="140" textAnchor="middle" fontSize="7" fill="#5B4B8A" fontFamily="Silkscreen, monospace">DEAD AIR FM</text>
        {/* needle */}
        <g className={cn('dial-needle', tuning && 'seeking')} style={{ transform: tuned ? 'rotate(10deg)' : tuning ? undefined : 'rotate(-62deg)' }}>
          <rect x="99" y="30" width="2" height="70" fill={tuned ? '#3F8F8B' : '#FF3B3B'} />
          <circle cx="100" cy="100" r="6" fill="#271F42" />
        </g>
        {/* knob */}
        <g className="dial-knob" style={{ transform: busy ? 'rotate(250deg)' : 'rotate(0deg)' }}>
          <circle cx="100" cy="100" r="22" fill="#7A68A8" />
          <circle cx="100" cy="100" r="22" fill="none" stroke="#271F42" strokeWidth="2" />
          <circle cx="100" cy="100" r="15" fill="#5B4B8A" />
          <rect x="97.5" y="80" width="5" height="14" fill="#FFB347" />
        </g>
      </svg>
    </button>
  );
}
