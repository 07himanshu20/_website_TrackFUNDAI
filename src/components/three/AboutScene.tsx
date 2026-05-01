'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import AboutGlobe from './AboutGlobe';
import EnergyField from './EnergyField';
import AmbientStars from './AmbientStars';
import MeteorShower from './MeteorShower';

interface Props {
  theme: 'dark' | 'light';
}

/**
 * Dense starfield for the team section (~scroll 0.74+).
 */
function TeamStars({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null);
  const opRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const sp = scrollStore.progress;
    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };
    const target = ss(0.74, 0.84, sp);
    opRef.current += (target - opRef.current) * 0.055;
    groupRef.current.visible = opRef.current > 0.01;
    groupRef.current.scale.setScalar(opRef.current > 0.01 ? 1 : 0);
  });

  return (
    <group ref={groupRef} visible={false}>
      <AmbientStars theme={theme} count={1200} />
    </group>
  );
}

/**
 * Meteor shower gated to the CTA section only (~scroll 0.88+).
 * Wraps MeteorShower and drives its group visibility imperatively.
 */
function CTAMeteors({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null);
  const opRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const sp = scrollStore.progress;
    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };
    // Fade in at 0.88, full by 0.93, stays until page end
    const target = ss(0.88, 0.93, sp);
    opRef.current += (target - opRef.current) * 0.06;
    const op = opRef.current;
    groupRef.current.visible = op > 0.01;
    // Pass opacity to children via group — MeteorShower reads it from prop
  });

  return (
    <group ref={groupRef} visible={false}>
      <MeteorShower theme={theme} />
    </group>
  );
}

/**
 * About page 3D scene.
 * Scroll bands:
 *   0.00–0.55  → CapitalGlobe (starts far right, rolls to center by 0.28; dimmed at ~0.35 via CSS veil)
 *   0.43–0.80  → EnergyField (timeline backdrop — starts as globe fades, earlier than before)
 *   0.74–1.00  → Dense starfield (team section)
 *   0.88–1.00  → Meteor shower (CTA section only)
 */
export default function AboutScene({ theme }: Props) {
  return (
    <>
      <AboutGlobe  theme={theme} />
      <EnergyField theme={theme} />
      <TeamStars   theme={theme} />
      <CTAMeteors  theme={theme} />
    </>
  );
}
