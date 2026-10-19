
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRadio } from '../../hooks/useRadioState';
import { cn, formatFrequency } from '../../lib/utils';
import AudioControls from '../ui/AudioControls';
import SignalIndicator from '../ui/SignalIndicator';

const LINKS = [
  { href: '#station-id', label: 'Station record' },
  { href: '#story', label: 'Story' },
  { href: '#archive', label: 'Archive' },
  { href: '#night-log', label: 'Night log' },
];

export default function Navigation() {
  const { frequency, secretUnlocked } = useRadio();
  const [open, setOpen] = useState(false);

  const f = formatFrequency(frequency);
  const links = secretUnlocked
    ? [...LINKS, { href: '#am-1717', label: 'AM 1717' }]
    : LINKS;

  // Close the mobile menu when the viewport reaches desktop width.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    if (mediaQuery.matches) setOpen(false);

    mediaQuery.addEventListener('change', handleDesktop);
    return () => mediaQuery.removeEventListener('change', handleDesktop);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-void/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8"
      >
        <a href="#hero" className="flex items-center gap-3">
          <span className="font-silk text-[12px] text-cream">
            Dead Air FM
          </span>

          <span className="flex items-center gap-2" aria-live="off">
            <span
              className="led-readout text-2xl"
              aria-label={`Tuned to ${f.unit} ${f.value}`}
            >
              {f.value}
            </span>
            <span className="hidden font-silk text-[10px] text-muted sm:inline">
              {f.unit}
            </span>
            <SignalIndicator
              level={4}
              className="hidden scale-75 sm:inline-flex"
            />
          </span>
        </a>

        {/* Desktop navigation: visible at 768px and wider. */}
        <ul className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'px-1 py-2 font-body text-[13px] hover:text-amber',
                  link.href === '#am-1717'
                    ? 'glow-amber'
                    : 'text-muted',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <AudioControls className="hidden sm:inline-flex" />

          {/* Mobile hamburger: hidden on desktop. */}
          <button
            type="button"
            className={cn(
              'btn-radio !px-3',
              '!hidden md:!hidden',
              'max-md:!inline-flex',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-white/5 bg-void/95 px-4 pb-4 md:hidden"
        >
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-body text-sm text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <AudioControls className="mt-2" />
        </div>
      )}
    </header>
  );
}
