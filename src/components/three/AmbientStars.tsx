'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  theme: 'dark' | 'light';
  count?: number;
}

/**
 * Always-on ambient star field with vertex colors and three size tiers
 * so the background is clearly visible in both dark and light themes.
 */
export default function AmbientStars({ theme, count = 600 }: Props) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 55;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 38 - 5;

      // Three tiers: tiny dim, medium bright, large vivid
      const tier = Math.random();
      if (tier < 0.60) {
        // Small dim stars — white/blue tint
        col[i * 3]     = 0.82; col[i * 3 + 1] = 0.80; col[i * 3 + 2] = 1.0;
        sizes[i] = 0.018 + Math.random() * 0.014;
      } else if (tier < 0.85) {
        // Medium accent-colored
        const pick = Math.random();
        if (pick < 0.4) {
          col[i * 3] = 0.65; col[i * 3 + 1] = 0.55; col[i * 3 + 2] = 0.98; // purple
        } else if (pick < 0.7) {
          col[i * 3] = 0.94; col[i * 3 + 1] = 0.67; col[i * 3 + 2] = 0.99; // pink
        } else {
          col[i * 3] = 0.98; col[i * 3 + 1] = 0.75; col[i * 3 + 2] = 0.47; // warm
        }
        sizes[i] = 0.030 + Math.random() * 0.018;
      } else {
        // Large bright stars — pure white with slight color cast
        col[i * 3]     = 1.0; col[i * 3 + 1] = 0.96; col[i * 3 + 2] = 1.0;
        sizes[i] = 0.048 + Math.random() * 0.022;
      }
    }

    g.setAttribute('position', new THREE.BufferAttribute(pos,   3));
    g.setAttribute('color',    new THREE.BufferAttribute(col,   3));
    g.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.005;
    ref.current.rotation.x = Math.sin(t * 0.003) * 0.02;
  });

  const isDark = theme === 'dark';
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={isDark ? 0.88 : 0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
