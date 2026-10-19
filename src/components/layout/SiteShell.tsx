import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRadio } from '../../hooks/useRadioState';
import CursorTrail from '../effects/CursorTrail';
import Footer from './Footer';
import Navigation from './Navigation';

/** Frame around the whole site: CRT overlays, nav, footer, and the scroll → frequency link. */
export default function SiteShell({ children }: { children: ReactNode }) {
  const { setFrequency, tunedIn } = useRadio();

  useEffect(() => {
    if (!tunedIn || typeof IntersectionObserver === 'undefined') return;
    const els = document.querySelectorAll<HTMLElement>('[data-frequency]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const f = Number((e.target as HTMLElement).dataset.frequency);
            if (!Number.isNaN(f)) setFrequency(f);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tunedIn, setFrequency, children]);

  return (
    <>
      {/* Outside .site-on on purpose: that wrapper is animated, and a fixed canvas must stay viewport-sized. */}
      <CursorTrail />
      <div className="site-on relative">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}