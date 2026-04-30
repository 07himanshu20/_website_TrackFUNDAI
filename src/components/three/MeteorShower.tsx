'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  theme: 'dark' | 'light';
  /** 0..1 visibility multiplier */
  opacity?: number;
}

const METEOR_COUNT = 22;

interface Meteor {
  // Trail geometry — line from tail to head
  trailGeo: THREE.BufferGeometry;
  trailMat: THREE.LineBasicMaterial;
  trail: THREE.Line;
  // Glow head — small sphere
  headGeo: THREE.BufferGeometry;
  headMat: THREE.MeshBasicMaterial;
  head: THREE.Mesh;
  // Motion state
  startX: number;
  startY: number;
  startZ: number;
  velX: number;
  velY: number;
  velZ: number;
  speed: number;
  progress: number;   // 0..1 within current "flight"
  lifetime: number;   // total flight duration in seconds
  delay: number;      // initial wait before first fire
  trailLength: number;
  color: THREE.Color;
  brightness: number;
}

function randomMeteor(isDark: boolean): Meteor {
  // Entry from top-right quadrant, exit bottom-left — cinematic diagonal
  const startX =  6  + Math.random() * 8;
  const startY =  4  + Math.random() * 5;
  const startZ = -2  - Math.random() * 4;

  const angle  = Math.PI * (0.75 + Math.random() * 0.25); // mostly leftward
  const slope  = -(0.28 + Math.random() * 0.22);           // gentle downward
  const speed  = 1.8 + Math.random() * 2.4;                // much slower — cinematic drift

  const velX = Math.cos(angle) * speed;
  const velY = slope * speed;
  const velZ = (Math.random() - 0.3) * 0.4;

  const trailLen = 2.2 + Math.random() * 2.8;              // longer tails to compensate

  // Colors: mostly white-blue, occasional purple/pink
  const palette = isDark
    ? ['#ffffff', '#e0d8ff', '#c4b5fd', '#f0abfc', '#fbbf77', '#a0c4ff']
    : ['#4c1d95', '#6d28d9', '#be185d', '#7c3aed', '#c2410c', '#1e1b4b'];
  const colorStr = palette[Math.floor(Math.random() * palette.length)];

  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(6); // 2 points × 3
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));

  const trailMat = new THREE.LineBasicMaterial({
    color: colorStr,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    linewidth: 1,
  });

  const trail = new THREE.Line(trailGeo, trailMat);

  const headGeo = new THREE.SphereGeometry(0.045, 6, 6);
  const headMat = new THREE.MeshBasicMaterial({
    color: colorStr,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const head = new THREE.Mesh(headGeo, headMat);

  return {
    trailGeo, trailMat, trail,
    headGeo, headMat, head,
    startX, startY, startZ,
    velX, velY, velZ,
    speed,
    progress: -(Math.random()),         // negative = waiting in delay
    lifetime: (trailLen + 18) / speed,  // seconds to cross scene
    delay: Math.random() * 6,
    trailLength: trailLen,
    color: new THREE.Color(colorStr),
    brightness: isDark ? (0.8 + Math.random() * 0.2) : (0.6 + Math.random() * 0.3),
  };
}

/**
 * Cinematic 3D meteor shower.
 * Each meteor is a LINE (tail) + glowing SPHERE head, traveling
 * top-right → bottom-left at varying speeds with additive blending.
 * Meteors loop continuously, each on its own random timer.
 */
export default function MeteorShower({ theme, opacity = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const isDark = theme === 'dark';

  const meteors = useMemo<Meteor[]>(
    () => Array.from({ length: METEOR_COUNT }, () => randomMeteor(isDark)),
    [isDark],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    meteors.forEach((m) => {
      m.progress += delta / m.lifetime;

      // When a flight completes, reset for the next one
      if (m.progress > 1.15) {
        m.progress = -(Math.random() * 0.8);
        // Randomise entry point slightly
        m.startX =  6  + Math.random() * 8;
        m.startY =  4  + Math.random() * 5;
      }

      const p = m.progress;

      // While waiting (p < 0) keep invisible
      if (p <= 0) {
        m.trailMat.opacity = 0;
        m.headMat.opacity  = 0;
        return;
      }

      // Head world position
      const hx = m.startX + m.velX * p * m.lifetime;
      const hy = m.startY + m.velY * p * m.lifetime;
      const hz = m.startZ + m.velZ * p * m.lifetime;

      // Tail position (trail behind head)
      const tailFrac = Math.max(0, p - m.trailLength / (m.speed * m.lifetime));
      const tx = m.startX + m.velX * tailFrac * m.lifetime;
      const ty = m.startY + m.velY * tailFrac * m.lifetime;
      const tz = m.startZ + m.velZ * tailFrac * m.lifetime;

      // Update trail geometry
      const arr = m.trailGeo.attributes.position.array as Float32Array;
      arr[0] = tx; arr[1] = ty; arr[2] = tz;
      arr[3] = hx; arr[4] = hy; arr[5] = hz;
      m.trailGeo.attributes.position.needsUpdate = true;

      // Update head position
      m.head.position.set(hx, hy, hz);

      // Fade envelope: ramp in quickly, hold, ramp out
      const fadeIn  = Math.min(1, p * 8);
      const fadeOut = Math.max(0, 1 - Math.max(0, p - 0.85) * 6);
      const env = fadeIn * fadeOut * m.brightness * opacity;

      m.trailMat.opacity = Math.max(0, (isDark ? 0.85 : 0.65) * env);
      m.headMat.opacity  = Math.max(0, (isDark ? 1.0  : 0.80) * env);
    });
  });

  return (
    <group ref={groupRef}>
      {meteors.map((m, i) => (
        <group key={i}>
          <primitive object={m.trail} />
          <primitive object={m.head} />
        </group>
      ))}
    </group>
  );
}
