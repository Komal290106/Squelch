import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  title: string;
  status?: string;
  tone?: 'violet' | 'teal' | 'amber' | 'red';
  className?: string;
  children: ReactNode;
}

export default function TerminalPanel({ title, status, tone = 'violet', className, children }: Props) {
  return (
    <div className={cn('panel', className)} data-tone={tone === 'violet' ? undefined : tone}>
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2 font-silk text-[11px] text-muted">
        <span className="truncate">{title}</span>
        {status && <span className="shrink-0 text-[10px]">{status}</span>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
