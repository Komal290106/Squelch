
import { useState } from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { useRadio } from '../../hooks/useRadioState';
import { frequencyLabel } from '../../lib/utils';

const CONTACTS = [
  {
    label: 'Email',
    href: 'mailto:dhillonkomal59@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/komal-kaur-dhillon/?isSelfProfile=true',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Komal290106',
    icon: Github,
  },
  {
    label: 'Portfolio',
    href: 'https://komal.itsfolio.tech/',
    icon: Globe,
  },
];

export default function Footer() {
  const { frequency, secretUnlocked, forceSecret, discovered } = useRadio();
  const [taps, setTaps] = useState(0);

  const tap = () => {
    const next = taps + 1;
    setTaps(next);

    if (next >= 5 && !secretUnlocked) {
      forceSecret();
    }
  };

  return (
    <footer
      id="footer"
      data-frequency="88.1"
      className="border-t border-white/5 px-5 pb-10 pt-10 sm:px-10 sm:pt-12"
    >
      {/* Station information */}
      <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-3 md:gap-8">
        <div>
          <p className="font-pixel text-2xl text-cream">Dead Air FM</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Broadcasting from Lowtide Hollow.
            <br />
            Operator on duty: Squelch.
          </p>
        </div>

        <dl className="space-y-1 text-sm">
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-muted">Tuned to</dt>
            <dd className="led-readout text-xl">
              {frequencyLabel(frequency)}
            </dd>
          </div>

          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-muted">Status</dt>
            <dd className="text-phosphor">Transmitting</dd>
          </div>

          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-muted">Program</dt>
            <dd className="text-cream">The Recording (repeat)</dd>
          </div>

          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-muted">Logged</dt>
            <dd className="text-cream">{discovered.length}/3 stations</dd>
          </div>
        </dl>

        <div className="text-xs leading-relaxed text-muted">
  <p>
    A little radio, a forgotten town, and the signals
    that never found their way home.
  </p>
  <p className="mt-2">
    Built with curiosity, pixels, and a little bit of static.
  </p>
</div>
      </div>

      {/* Counter and Lowtide Ring */}
      <div className="mx-auto mt-8 grid max-w-5xl gap-6 border-t border-white/5 pt-6 sm:grid-cols-2 sm:items-center">
        {/* Visit counter */}
        <div
          data-testid="visit-counter"
          className="text-xs text-muted"
        >
          <p className="mb-2 font-silk text-[10px] tracking-widest text-teal">
            YOU HAVE TUNED IN
          </p>

          <div
            className="flex items-center gap-1"
            aria-label="Visits: 00001"
          >
            <span aria-hidden="true" className="flex items-center gap-1">
              {'00001'.split('').map((digit, index) => (
                <span
                  key={index}
                  className="border border-white/10 bg-white/[0.03] px-1.5 py-1 font-pixel text-amber"
                >
                  {digit}
                </span>
              ))}
            </span>
            <span className="ml-1">TIMES</span>
          </div>

          <p className="mt-2 text-[10px] text-muted/70">
            A little signal from Lowtide Hollow.
          </p>
        </div>

        {/* Lowtide Ring navigation */}
        <nav
          aria-label="Lowtide Ring"
          className="sm:text-right"
        >
          <p className="font-silk text-[10px] tracking-widest text-teal">
            ✦ LOWTIDE RING
          </p>

          <div className="mt-3 flex items-center justify-start gap-3 font-body text-xs text-muted sm:justify-end">
            <a
              href="#story"
              aria-label="Previous station"
              className="transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              ‹ prev
            </a>

            <span className="text-cream">
              Dead Air FM · 3 of 7
            </span>

            <a
              href="#frequency-archive"
              aria-label="Next station"
              className="transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              next ›
            </a>
          </div>

          <p className="mt-2 text-[11px] text-muted/70">
            The other four stations are asleep.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:justify-end">
            {CONTACTS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                aria-label={label}
                title={label}
                className="inline-flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] text-muted transition-colors hover:border-amber/50 hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            ))}
          </div>

          <p className="mt-2 text-[10px] text-muted/60">
            Find the operator elsewhere.
          </p>
        </nav>
      </div>

      {/* Closing line */}
      <div className="mx-auto mt-7 flex max-w-5xl items-center justify-between gap-4 border-t border-white/5 pt-5">
        <p className="font-term text-base text-amber sm:text-xl">
          Thank you for staying on the frequency.
        </p>

        <button
          type="button"
          onClick={tap}
          aria-label={`Pilot lamp, ${taps} of 5 taps`}
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span
            className={`h-2 w-2 rounded-full bg-amber ${
              taps ? 'anim-lamp' : 'opacity-40'
            }`}
          />
        </button>
      </div>

      {taps > 0 && taps < 5 && !secretUnlocked && (
        <p
          className="mx-auto mt-1 max-w-5xl text-right text-[11px] text-muted/60"
          aria-live="polite"
        >
          The lamp flickers back. ({taps}/5)
        </p>
      )}

      {taps >= 5 && secretUnlocked && (
        <p
          className="mx-auto mt-1 max-w-5xl text-right text-[11px] text-amber"
          aria-live="polite"
        >
          Somewhere on the dial, a carrier wakes up. AM 1717.
        </p>
      )}
    </footer>
  );
}
