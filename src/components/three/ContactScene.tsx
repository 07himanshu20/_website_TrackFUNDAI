'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import CapitalGlobe from './CapitalGlobe';
import ContactNebula from './ContactNebula';

interface Props {
  theme: 'dark' | 'light';
}

/**
 * Contact page 3D scene.
 *
 * Scroll crossfade:
 *   0.00–0.14  → CapitalGlobe fully visible (hero section)
 *   0.14–0.36  → CapitalGlobe fades out, ContactNebula rises in (spacer zone)
 *   0.36–1.00  → ContactNebula dominates (form + info section)
 *
 * CapitalGlobe visibility is driven here imperatively — the group wrapping it
 * fades its scale from 1→0 so the globe dissolves without flickering.
 */
function FadingGlobe({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null);
  const opRef    = useRef(1);

  useFrame(() => {
    if (!groupRef.current) return;
    const sp = scrollStore.progress;
    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };
    // Globe fades from full visibility down to 0 over the spacer zone
    const target = 1 - ss(0.12, 0.34, sp);
    opRef.current += (target - opRef.current) * 0.05;
    const op = opRef.current;
    groupRef.current.visible = op > 0.01;
    groupRef.current.scale.setScalar(op > 0.01 ? op : 0);
  });

  return (
    <group ref={groupRef}>
      <CapitalGlobe theme={theme} visibility={1} />
    </group>
  );
}

export default function ContactScene({ theme }: Props) {
  return (
    <>
      <FadingGlobe    theme={theme} />
      <ContactNebula  theme={theme} />
    </>
  );
}
