'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';

interface Props {
  theme: 'dark' | 'light';
}

const CURTAIN_COUNT = 16;
const PARTICLE_COUNT = 1600;
const BEAM_COUNT = 6;
const SEGS = 80;

/**
 * Cinematic energy-field backdrop for the About page timeline section.
 * Appears when scroll ~0.50–0.80, fades out after.
 *
 * Visual layers:
 *  1. Particle cloud — wide, colorful, slow drift
 *  2. Energy curtains — vertical sine-wave lines that ripple
 *  3. Volumetric light beams — tall translucent cylinders
 */
export default function EnergyField({ theme }: Props) {
  const groupRef    = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);
  const curtainGroupRef = useRef<THREE.Group>(null);

  const isDark = theme === 'dark';

  // Particle cloud — wide, flat, deep
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      const t = Math.random();
      // purple → pink gradient
      col[i * 3]     = THREE.MathUtils.lerp(0.67, 0.94, t);
      col[i * 3 + 1] = THREE.MathUtils.lerp(0.55, 0.67, t);
      col[i * 3 + 2] = THREE.MathUtils.lerp(0.98, 0.99, t);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  // Curtain geometries — each is a BufferGeometry we'll mutate per-frame
  const curtainData = useMemo(() => {
    return Array.from({ length: CURTAIN_COUNT }, (_, ci) => {
      const geo  = new THREE.BufferGeometry();
      const pos  = new Float32Array((SEGS + 1) * 3);
      const xPos = (ci / (CURTAIN_COUNT - 1) - 0.5) * 18;
      for (let i = 0; i <= SEGS; i++) {
        const y = (i / SEGS - 0.5) * 14;
        pos[i * 3]     = xPos;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = 0;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3));
      const color =
        ci % 3 === 0 ? '#f0abfc' :
        ci % 3 === 1 ? (isDark ? '#a78bfa' : '#6d28d9') :
                       '#fbbf77';
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      return { geo, mat, line, xPos, phase: (ci / CURTAIN_COUNT) * Math.PI * 2 };
    });
  }, [isDark]);

  // Beam data
  const beamData = useMemo(() =>
    Array.from({ length: BEAM_COUNT }, (_, i) => ({
      x: (i / (BEAM_COUNT - 1) - 0.5) * 14,
      phase: (i / BEAM_COUNT) * Math.PI * 2,
      color: i % 2 === 0 ? (isDark ? '#c4b5fd' : '#7c3aed') : '#f0abfc',
    })),
  [isDark]);

  const opacityRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    // Fade in at 0.50, full by 0.58, fade out at 0.72, gone by 0.82
    const targetOp = ss(0.50, 0.58, sp) * (1 - ss(0.72, 0.82, sp));
    opacityRef.current += (targetOp - opacityRef.current) * 0.055;
    const op = opacityRef.current;

    groupRef.current.visible = op > 0.01;
    if (!groupRef.current.visible) return;

    // Subtle world tilt
    groupRef.current.rotation.y = Math.sin(t * 0.04) * 0.05;

    // Animate curtain sine waves
    curtainData.forEach(({ geo, mat, xPos, phase }) => {
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      if (!posAttr) return;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i <= SEGS; i++) {
        const y    = (i / SEGS - 0.5) * 14;
        const wave = Math.sin(y * 0.55 + t * 0.85 + phase) * (0.3 + 0.14 * Math.sin(t * 0.3 + phase));
        arr[i * 3]     = xPos + wave;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = Math.sin(y * 0.4 + t * 0.5 + phase * 0.7) * 0.4;
      }
      posAttr.needsUpdate = true;
      mat.opacity = (0.18 + 0.12 * Math.sin(t * 1.1 + phase)) * op;
    });

    // Particle cloud
    if (particleRef.current) {
      particleRef.current.rotation.y = t * 0.012;
      const m = particleRef.current.material as THREE.PointsMaterial;
      m.opacity = (isDark ? 0.60 : 0.50) * op;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Particle cloud */}
      <points ref={particleRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.032}
          vertexColors
          transparent
          opacity={isDark ? 0.60 : 0.50}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Energy curtains — rendered as primitive THREE.Line objects */}
      <group ref={curtainGroupRef}>
        {curtainData.map(({ line }, ci) => (
          <primitive key={ci} object={line} />
        ))}
      </group>

      {/* Volumetric light beams */}
      {beamData.map(({ x, color }, i) => (
        <mesh
          key={i}
          position={[x, 0, -1 - i * 0.25]}
        >
          <cylinderGeometry args={[0.07, 0.32, 18, 8, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.055}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
