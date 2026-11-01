'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MobileLayer from '@/components/mobile/MobileLayer';

interface PageFrameProps {
  /** Matches the scoped stylesheet: `.pg-<page>` in src/styles/<page>.css */
  page: string;
  children: ReactNode;
  /** Rendered before the header (e.g. the home intro overlay). */
  before?: ReactNode;
  /** Rendered after the footer (drawers, dialogs...). */
  after?: ReactNode;
  /** html scroll-padding-top, so anchor jumps clear the fixed header. */
  scrollPad?: number;
  /** Set false when the page runs its own reveal animation (home uses GSAP). */
  reveal?: boolean;
  toastMs?: number;
}

export default function PageFrame(props: PageFrameProps) {
  return (
    <ToastProvider defaultMs={props.toastMs}>
      <Frame {...props} />
    </ToastProvider>
  );
}

function Frame({ page, children, before, after, scrollPad = 150, reveal = true }: PageFrameProps) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

  useReveal(root, reveal);

  useEffect(() => {
    const el = document.documentElement;
    el.style.scrollPaddingTop = `${scrollPad}px`;
    return () => {
      el.style.scrollPaddingTop = '';
    };
  }, [scrollPad]);

  // One delegated click handler for the small "data-*" conventions used in the markup.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const placeholder = target.closest('a[href="#"]');
    if (placeholder) return e.preventDefault();
    const msg = target.closest<HTMLElement>('[data-msg]');
    if (msg?.dataset.msg) return toast(msg.dataset.msg);
    const card = target.closest<HTMLElement>('[data-href]');
    if (card?.dataset.href && !target.closest('a')) router.push(card.dataset.href);
  };

  return (
    <div ref={root} className={`pg-${page} mx`} onClick={onClick}>
      {before}
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      {after}
      <MobileLayer />
    </div>
  );
}
