'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore } from './scrollStore';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.85,
    });

    let lastScroll = 0;
    lenis.on('scroll', (e: { scroll: number }) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? e.scroll / scrollHeight : 0;
      scrollStore.progress = Math.min(1, Math.max(0, progress));
      scrollStore.velocity = e.scroll - lastScroll;
      lastScroll = e.scroll;
      ScrollTrigger.update();
    });

    gsap.ticker.lagSmoothing(0);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
