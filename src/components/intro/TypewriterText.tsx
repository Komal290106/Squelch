import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/utils';

interface Props {
  text: string;
  speed?: number;      // ms per character
  startDelay?: number; // ms before the first character
  cursor?: boolean;    // keep a blinking cursor after finishing
  onDone?: () => void;
  className?: string;
}

/** Types text one character at a time. Screen readers get the full text immediately. */
export default function TypewriterText({ text, speed = 70, startDelay = 0, cursor = true, onDone, className }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (prefersReducedMotion()) {
      setCount(text.length);
      onDone?.();
      return;
    }
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          window.clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  const done = count >= text.length;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, count)}</span>
      {(cursor || !done) && <span className="cursor" aria-hidden />}
    </span>
  );
}
