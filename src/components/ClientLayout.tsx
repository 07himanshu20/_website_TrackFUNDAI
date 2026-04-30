'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ThemeProvider, { useTheme } from './ThemeProvider';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer';
import SmoothScroll from './SmoothScroll';
import Loader from './Loader';
import { scrollStore } from './scrollStore';

const Scene = dynamic(() => import('./three/Scene'), { ssr: false });

function Inner({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    scrollStore.progress = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <SmoothScroll />
      <Loader />
      <Scene theme={theme} pathname={pathname} />
      <Navbar />
      <main className="page-shell">{children}</main>
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Inner>{children}</Inner>
    </ThemeProvider>
  );
}
