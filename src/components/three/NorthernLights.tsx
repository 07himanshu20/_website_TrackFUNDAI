'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  theme: 'dark' | 'light';
}

const CURTAIN_COUNT = 14;
const STAR_COUNT    = 1800;

interface Curtain {
  line: THREE.Line;
  mat:  THREE.LineBasicMaterial;
  geo:  THREE.BufferGeometry;
  xPos: number;
  phase: number;
  speed: number;
  hue:  number; // 0=green, 1=teal, 2=purple
}

export default function NorthernLights({ theme }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const isDark = theme === 'dark';

  // ── Curtains ──────────────────────────────────────────────
  const curtains = useMemo<Curtain[]>(() => {
    const cols = isDark
      ? ['#00ffb3', '#00e5ff', '#7b2fff', '#ff2fff', '#00ff88', '#22aaff', '#aa44ff']
      : ['#006644', '#004488', '#441188', '#880088', '#003322', '#004466', '#553388'];

    return Array.from({ length: CURTAIN_COUNT }, (_, ci) => {
      const SEG = 48;
      const pos = new Float32Array((SEG + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const colorHex = cols[ci % cols.length];
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        linewidth: 1,
      });
      const line = new THREE.Line(geo, mat);

      return {
        line, mat, geo,
        xPos: -9 + (ci / (CURTAIN_COUNT - 1)) * 18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.22,
        hue: ci % 3,
      };
    });
  }, [isDark]);

  // ── Stars ──────────────────────────────────────────────────
  const starGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos    = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes  = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Spread across a wide dome above and around camera
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -5 - Math.random() * 15;

      // Three tiers: white-blue, purple, warm white
      const tier = Math.random();
      if (tier < 0.6) {
        colors[i * 3] = 0.88 + Math.random() * 0.12;
        colors[i * 3 + 1] = 0.88 + Math.random() * 0.12;
        colors[i * 3 + 2] = 1.0;
      } else if (tier < 0.85) {
        colors[i * 3] = 0.65 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.45 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.92 + Math.random() * 0.08;
        colors[i * 3 + 2] = 0.78 + Math.random() * 0.2;
      }
      sizes[i] = 0.012 + Math.random() * 0.042;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  // ── Per-frame animation ───────────────────────────────────
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const SEG = 48;

    // Gently rotate the whole group — makes stars drift
    groupRef.current.rotation.y = t * 0.014;
    groupRef.current.rotation.x = Math.sin(t * 0.007) * 0.04;

    curtains.forEach((c) => {
      const posAttr = c.geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let s = 0; s <= SEG; s++) {
        const frac = s / SEG;
        const y = -3 + frac * 9;        // vertical sweep from -3 to +6
        // Each curtain ripples horizontally
        const ripple =
          Math.sin(frac * Math.PI * 3 + t * c.speed + c.phase) * 0.55 +
          Math.sin(frac * Math.PI * 5 + t * c.speed * 0.6 + c.phase * 1.3) * 0.25;
        const x = c.xPos + ripple;
        const z = -3 + Math.sin(frac * Math.PI + c.phase + t * 0.08) * 1.2;

        arr[s * 3]     = x;
        arr[s * 3 + 1] = y;
        arr[s * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;

      // Pulsing opacity — each curtain breathes at its own rate
      const pulse = 0.5 + 0.5 * Math.sin(t * c.speed * 0.8 + c.phase);
      const baseOp = isDark
        ? (c.hue === 0 ? 0.70 : c.hue === 1 ? 0.55 : 0.60)
        : (c.hue === 0 ? 0.45 : c.hue === 1 ? 0.38 : 0.42);
      c.mat.opacity = baseOp * (0.55 + 0.45 * pulse);
    });
  });

  return (
    <group ref={groupRef}>
      {/* Stars */}
      <points geometry={starGeo}>
        <pointsMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.92 : 0.60}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.025}
        />
      </points>

      {/* Northern light curtains */}
      {curtains.map((c, i) => (
        <primitive key={i} object={c.line} />
      ))}

      {/* Wide volumetric aurora glow planes — large translucent quads */}
      <mesh position={[0, 1.5, -5]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[28, 8]} />
        <meshBasicMaterial
          color={isDark ? '#00ffb3' : '#006633'}
          transparent opacity={isDark ? 0.040 : 0.025}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[2, 0.5, -6]} rotation={[-0.08, 0.15, 0]}>
        <planeGeometry args={[22, 7]} />
        <meshBasicMaterial
          color={isDark ? '#7b2fff' : '#441188'}
          transparent opacity={isDark ? 0.045 : 0.028}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-3, 2.0, -7]} rotation={[0.05, -0.1, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshBasicMaterial
          color={isDark ? '#00e5ff' : '#004488'}
          transparent opacity={isDark ? 0.035 : 0.020}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
