import { cn } from '../../lib/utils';

interface Props {
  level: number; // 0..5
  tone?: 'green' | 'amber' | 'red';
  label?: string;
  className?: string;
}

export default function SignalIndicator({ level, tone = 'green', label = 'Signal strength', className }: Props) {
  const heights = [6, 10, 14, 18, 22];
  return (
    <span
      role="img"
      aria-label={`${label}: ${level} of 5`}
      className={cn('inline-flex items-end gap-[3px] h-[22px]', className)}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="sig-bar"
          data-on={i < level}
          data-tone={tone === 'green' ? undefined : tone}
          style={{ height: h }}
        />
      ))}
    </span>
  );
}
