import { useCallback, useEffect, useRef, useState } from 'react';
import { useRadio } from '../../hooks/useRadioState';
import { playSfx, playTypeTick, setIntroGate, startAmbient, startSearchStatic, stopSearchStatic, stopTypeTick } from '../../lib/audio';
import { cn, prefersReducedMotion } from '../../lib/utils';
import AudioControls from '../ui/AudioControls';
import FrequencyDial from './FrequencyDial';
import TypewriterText from './TypewriterText';

type Stage = 'black' | 'typing' | 'details' | 'dial' | 'tuning' | 'connected';
const DETAILS = ['SEARCHING FOR SIGNAL...', 'SIGNAL SOURCE: UNKNOWN', 'NO CARRIER DETECTED'];

export default function TransmissionIntro() {
  const { tunedIn, startTransmission, tuneIn, endIntro, setFrequency } = useRadio();
  const [stage, setStage] = useState<Stage>('black');
  const [shownDetails, setShownDetails] = useState(0);
  const [dialReady, setDialReady] = useState(false);
  const [freq, setFreq] = useState('--.-');
  const timers = useRef<number[]>([]);
  // The status-line sequence must run exactly once. "Skip transmission" shows all lines at once, but the
  // typewriter is still mounted and calls onDone later; without this guard it replayed the sequence.
  const detailsStarted = useRef(false);
  // Typing ticks are only for the opening sentence. Switched off the moment the visitor skips or tunes,
  // and when this component unmounts.
  const typingSound = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // Audio housekeeping. While the intro is mounted, the ambient static only plays when the intro asks for it,
  // and everything the intro started is stopped on the way out.
  useEffect(() => {
    typingSound.current = true;
    setIntroGate(true);
    return () => {
      typingSound.current = false;
      stopTypeTick();
      stopSearchStatic(0);
      setIntroGate(false);
    };
  }, []);

  // Very quiet "searching for someone" static once the status lines (and dial) are on screen.
  // The tuning step below ramps this same loop up; it is never restarted.
  const searching = shownDetails > 0 && (stage === 'details' || stage === 'dial');
  useEffect(() => {
    if (searching) startSearchStatic();
  }, [searching]);

  const onTypeTick = useCallback((count: number, char: string) => {
    // Every other letter, never on spaces: a soft rhythm rather than a machine gun.
    if (!typingSound.current || char === ' ' || count % 2 === 0) return;
    playTypeTick();
  }, []);

  // Opening: black → red sentence.
  useEffect(() => {
    const t = prefersReducedMotion() ? 200 : 1400;
    later(() => { setStage('typing'); startTransmission(); }, t);
    return () => timers.current.forEach(window.clearTimeout);
  }, [later, startTransmission]);

  const showDetails = useCallback(() => {
    if (detailsStarted.current) return;
    detailsStarted.current = true;
    setStage((s) => (s === 'typing' ? 'details' : s));
    DETAILS.forEach((_, i) => later(() => setShownDetails(i + 1), 500 + i * 650));
    later(() => { setStage((s) => (s === 'details' ? 'dial' : s)); setDialReady(true); }, 500 + DETAILS.length * 650 + 500);
  }, [later]);

  const skipToDial = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    typingSound.current = false;
    stopTypeTick();
    detailsStarted.current = true;
    setShownDetails(DETAILS.length);
    setStage('dial');
    setDialReady(true);
    startTransmission();
  };

  const tune = (quick = false) => {
    if (stage === 'tuning' || stage === 'connected') return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    typingSound.current = false;
    stopTypeTick();
    playSfx('dialClick');
    startAmbient(0.12);
    later(() => playSfx('tuneIn'), 250);
    setStage('tuning');
    const total = quick || prefersReducedMotion() ? 700 : 2200;
    const spin = window.setInterval(() => setFreq((87.5 + Math.random() * 20).toFixed(1)), 70);
    later(() => {
      window.clearInterval(spin);
      setFreq('88.1');
      setFrequency(88.1);
      setStage('connected');
    }, total);
    later(() => tuneIn(), total + (quick ? 300 : 1300));
    later(() => endIntro(), total + (quick ? 300 : 1300) + 1500);
  };

  const state = stage === 'tuning' ? 'tuning' : stage === 'connected' ? 'connected' : 'searching';
  const connected = stage === 'connected';

  return (
    <div
      className={cn('intro-root fixed inset-0 z-[80] flex flex-col items-center justify-center bg-void px-5 text-center', tunedIn && 'intro-exit')}
      data-state={state}
      role="dialog"
      aria-label="Incoming transmission"
    >
      <div className={cn('relative flex w-full max-w-xl flex-col items-center', stage === 'tuning' && 'anim-tear')}>
        <p className="font-term text-3xl text-signal min-h-[1.4em] sm:text-5xl" aria-live="polite">
          {stage === 'black' ? null : connected ? (
            <TypewriterText key="found" text="There you are." speed={60} onDone={undefined} />
          ) : stage === 'tuning' ? (
            <span>Is anyone there?</span>
          ) : (
            <TypewriterText text="Is anyone there?" speed={85} onDone={showDetails} onTick={onTypeTick} />
          )}
        </p>

        <ul className="mt-6 min-h-[5.5rem] space-y-1 font-body text-[11px] text-signal/80 sm:text-xs" aria-label="Transmission status">
          {DETAILS.slice(0, shownDetails).map((d) => (
            <li key={d} className="anim-rise">
              {connected ? d.replace('SEARCHING FOR SIGNAL...', 'SIGNAL LOCKED').replace('UNKNOWN', 'LOWTIDE HOLLOW').replace('NO CARRIER DETECTED', 'CARRIER FOUND') : d}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col items-center gap-4">
          <FrequencyDial visible={dialReady} tuning={stage === 'tuning'} tuned={connected} onActivate={() => tune(false)} />
          <div className={cn('transition-opacity duration-1000', dialReady ? 'opacity-100' : 'opacity-0')} aria-live="polite">
            <p className="led-readout text-4xl" style={{ color: connected ? 'var(--phosphor)' : 'var(--signal)' }}>
              {freq} <span className="text-xl">FM</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              {stage === 'tuning' ? 'Tuning…' : connected ? 'Connected.' : 'Click the dial to tune in.'}
            </p>
          </div>
        </div>
      </div>

      {stage === 'tuning' && <div className="fx-bands" aria-hidden />}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
        <div className="min-h-[44px]">
          {(stage === 'typing' || stage === 'details') && (
            <button type="button" onClick={skipToDial} className="px-2 py-2 font-silk text-[11px] text-muted underline decoration-dotted underline-offset-4 hover:text-cream">
              Skip transmission
            </button>
          )}
          {stage === 'dial' && (
            <button type="button" onClick={() => tune(true)} className="px-2 py-2 font-silk text-[11px] text-muted underline decoration-dotted underline-offset-4 hover:text-cream">
              Continue without tuning
            </button>
          )}
        </div>
        <AudioControls />
      </div>
    </div>
  );
}