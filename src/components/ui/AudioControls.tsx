import { Volume2, VolumeX } from 'lucide-react';
import { useRadio } from '../../hooks/useRadioState';
import { cn } from '../../lib/utils';

export default function AudioControls({ className }: { className?: string }) {
  const { soundEnabled, toggleSound } = useRadio();
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? 'Mute sound' : 'Turn sound on'}
      className={cn('btn-radio !px-3', className)}
    >
      {soundEnabled ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
      <span>{soundEnabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
