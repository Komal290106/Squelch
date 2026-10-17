import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useRadio } from '../../hooks/useRadioState';
import SquelchCharacter from '../character/SquelchCharacter';
import TypewriterText from '../intro/TypewriterText';
import SignalIndicator from '../ui/SignalIndicator';
import TerminalPanel from '../ui/TerminalPanel';

export default function SecretFrequency() {
  const { secretUnlocked, discovered, replySubmitted, replyText, submitReply } = useRadio();
  const [draft, setDraft] = useState('');

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (text) submitReply(text);
  };

  return (
    <section id="am-1717" data-frequency="1717" className="px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl text-cream sm:text-5xl">{secretUnlocked ? 'AM 1717' : 'Nothing on AM 1717'}</h2>

        {!secretUnlocked ? (
          <TerminalPanel title="AM 1717 · NO CARRIER" status={`${discovered.length}/3 stations logged`} tone="red" className="mt-8">
            <p className="text-sm text-muted">Just hiss, and under the hiss, something patient. Log the three stations in the archive and listen again.</p>
            <SignalIndicator level={discovered.length} tone="red" className="mt-4" label="Hidden signal" />
          </TerminalPanel>
        ) : (
          <TerminalPanel title="AM 1717 · PRIVATE LINE" status="CARRIER FOUND" tone="amber" className="mt-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <SquelchCharacter mood={replySubmitted ? 'happy' : 'signal'} className="h-32 w-32 shrink-0" />
              <div className="w-full">
                <p className="font-term text-2xl text-amber">
                  <TypewriterText text="Oh. You found the other frequency." speed={35} cursor={false} />
                </p>
                <p className="mt-3 text-sm text-muted">
                  Squelch has never had a reply. Write one line for it. This stays in this browser tab only. It isn’t sent anywhere, and it disappears when you refresh.
                </p>

                {!replySubmitted ? (
                  <form onSubmit={send} className="mt-5">
                    <label htmlFor="msg" className="font-silk text-[11px] text-teal">Message for Squelch</label>
                    <textarea id="msg" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={280} rows={3} placeholder="Good evening…"
                      className="mt-2 w-full resize-none border border-white/15 bg-void/80 p-3 font-body text-sm text-cream placeholder:text-muted/60 focus:border-amber focus:outline-none" />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted">{draft.length}/280</span>
                      <button type="submit" disabled={!draft.trim()} className="btn-radio disabled:opacity-40"><Send size={14} aria-hidden /> Send on AM 1717</button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 space-y-4" aria-live="polite">
                    <p className="border-l-2 border-white/15 pl-3 text-sm text-muted">You: {replyText}</p>
                    <p className="font-pixel text-2xl text-cream sm:text-3xl">
                      <TypewriterText text="A new listener. Good evening. Take your time." speed={55} cursor={false} />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TerminalPanel>
        )}
      </div>
    </section>
  );
}
