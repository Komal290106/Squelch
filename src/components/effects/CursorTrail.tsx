import { useEffect, useRef } from 'react';

const COLORS = ['#FFB347', '#7CFFB2', '#3F8F8B', '#E8DFC8', '#7A68A8'];
const MAX_SPARKS = 28;
const SPAWN_DISTANCE = 16; // px of pointer travel per spark
const LIFETIME_MS = 650;

interface Spark {
  x: number;
  y: number;
  vx: number; // px per ms
  vy: number;
  age: number;
  size: number;
  color: string;
  plus: boolean;
}

/**
 * A subtle pixel-spark trail behind a mouse or pen pointer.
 *  - Only runs for fine, hover-capable pointers, and never when reduced motion is requested.
 *  - The canvas ignores the pointer, so it cannot block clicks or text selection, and it is fixed
 *    so it cannot shift layout.
 *  - The animation frame loop only runs while sparks are alive; it is idle otherwise.
 *  - Everything it registers is removed on unmount.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window.matchMedia !== 'function') return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sparks: Spark[] = [];
    let ctx: CanvasRenderingContext2D | null = null;
    let raf = 0;
    let lastFrame = 0;
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let travelled = 0;
    let listening = false;

    const resize = () => {
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    // The 2D context is only created the first time a spark is needed.
    const ensureContext = (): boolean => {
      if (ctx) return true;
      ctx = canvas.getContext('2d');
      if (!ctx) return false;
      resize();
      window.addEventListener('resize', resize);
      return true;
    };

    const clear = () => {
      if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const stopLoop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!ctx) return;
      const dt = lastFrame ? Math.min(now - lastFrame, 50) : 16;
      lastFrame = now;
      clear();
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= LIFETIME_MS) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = 1 - s.age / LIFETIME_MS;
        ctx.fillStyle = s.color;
        const x = Math.round(s.x);
        const y = Math.round(s.y);
        if (s.plus) {
          ctx.fillRect(x - 2, y, 5, 1);
          ctx.fillRect(x, y - 2, 1, 5);
        } else {
          ctx.fillRect(x, y, s.size, s.size);
        }
      }
      ctx.globalAlpha = 1;
      if (sparks.length) {
        raf = window.requestAnimationFrame(frame);
      } else {
        clear();
        lastFrame = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (!Number.isNaN(lastX)) travelled += Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      if (travelled < SPAWN_DISTANCE || !ensureContext()) return;
      travelled = 0;
      if (sparks.length >= MAX_SPARKS) sparks.shift();
      sparks.push({
        x: e.clientX + (Math.random() - 0.5) * 6,
        y: e.clientY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.03,
        vy: -0.01 - Math.random() * 0.03,
        age: 0,
        size: Math.random() < 0.5 ? 2 : 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        plus: Math.random() < 0.15,
      });
      if (!raf) raf = window.requestAnimationFrame(frame);
    };

    const apply = () => {
      const shouldRun = finePointer.matches && !reducedMotion.matches;
      if (shouldRun && !listening) {
        window.addEventListener('pointermove', onMove, { passive: true });
        listening = true;
      } else if (!shouldRun && listening) {
        window.removeEventListener('pointermove', onMove);
        listening = false;
        sparks.length = 0;
        lastX = Number.NaN;
        lastY = Number.NaN;
        travelled = 0;
        stopLoop();
        clear();
      }
    };

    apply();
    finePointer.addEventListener?.('change', apply);
    reducedMotion.addEventListener?.('change', apply);

    return () => {
      finePointer.removeEventListener?.('change', apply);
      reducedMotion.removeEventListener?.('change', apply);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      stopLoop();
      sparks.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full select-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}