'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';

type VisBag = { a: number; b: number; c: number; d: number };

interface Props {
  theme: 'dark' | 'light';
  visibility?: number;
  count?: number;
  visRef?: React.MutableRefObject<VisBag>;
  visKey?: keyof VisBag;
}

export default function DataNebula({ theme, visibility = 1, count = 1600, visRef, visKey }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const streamRef = useRef<THREE.Points>(null);

  // Build geometries entirely in useMemo — no ref access, pure data
  const cloudGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * 3);
      const armOffset = arm * ((Math.PI * 2) / 3);
      const radius = Math.pow(Math.random(), 0.55) * 7 + 0.5;
      const spinAngle = radius * 0.28;
      const angle = Math.random() * Math.PI * 2 + spinAngle + armOffset;
      const heightSpread = (Math.random() - 0.5) * 1.6 * (1 - Math.min(radius / 7, 1));

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = heightSpread;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Purple core → magenta → warm orange at edges
      const t = Math.min(radius / 7, 1);
      colors[i * 3] = THREE.MathUtils.lerp(0.55, 0.99, t);
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.45, 0.62, t);
      colors[i * 3 + 2] = THREE.MathUtils.lerp(0.99, 0.38, t);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  const streamGeo = useMemo(() => {
    const streamCount = 280;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(streamCount * 3);
    for (let i = 0; i < streamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const vis = visRef && visKey ? visRef.current[visKey] : visibility;
    groupRef.current.rotation.y = t * 0.045 + sp * 0.3;
    groupRef.current.rotation.x = -0.35 + Math.sin(t * 0.05) * 0.07;
    groupRef.current.scale.setScalar(vis);
    groupRef.current.visible = vis > 0.005;

    if (cloudRef.current) {
      const m = cloudRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.82 : 0.68) * vis;
      m.size = 0.055 + Math.sin(t * 0.4) * 0.008;
    }

    // Drift stream particles upward (data flowing)
    if (streamRef.current) {
      const posAttr = streamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      if (!posAttr) return;
      const arr = posAttr.array as Float32Array;
      const cnt = arr.length / 3;
      for (let i = 0; i < cnt; i++) {
        arr[i * 3 + 1] += 0.014;
        if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
      }
      posAttr.needsUpdate = true;

      const m = streamRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.6 : 0.5) * vis;
    }
  });

  const isDark = theme === 'dark';
  const streamColor = isDark ? '#c4b5fd' : '#6d28d9';

  return (
    <group ref={groupRef}>
      <points ref={cloudRef} geometry={cloudGeo}>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={isDark ? 0.82 : 0.68}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={streamRef} geometry={streamGeo}>
        <pointsMaterial
          size={0.035}
          color={streamColor}
          transparent
          opacity={isDark ? 0.6 : 0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
