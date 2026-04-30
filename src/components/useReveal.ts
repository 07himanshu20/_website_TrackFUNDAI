'use client';

import { useEffect } from 'react';

/**
 * Adds `.is-visible` to elements with `.reveal`, `.reveal-soft`, or
 * `.timeline-rail` when they enter the viewport. IntersectionObserver
 * based — cheap and decoupled from scroll.
 */
export default function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal:not(.is-visible), .reveal-soft:not(.is-visible), .timeline-rail:not(.is-visible)',
    );
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || '0', 10);
            if (delay > 0) {
              setTimeout(() => el.classList.add('is-visible'), delay);
            } else {
              el.classList.add('is-visible');
            }
            io.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}
