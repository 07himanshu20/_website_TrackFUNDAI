'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1700);
    const t2 = setTimeout(() => setHidden(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`tf-loader ${fade ? 'hidden' : ''}`} aria-hidden>
      <div className="tf-loader-mark">TF</div>
      <div className="tf-loader-bar" />
      <span className="eyebrow" style={{ opacity: 0.7 }}>
        TrackFundAI
      </span>
    </div>
  );
}
