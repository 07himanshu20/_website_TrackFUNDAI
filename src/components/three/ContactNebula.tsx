'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';

interface Props {
  theme: 'dark' | 'light';
}

const CLOUD_COUNT  = 2200;
const STREAK_COUNT = 320;
const BEAM_COUNT   = 8;
const RING_COUNT   = 5;

/**
 * Contact page cinematic nebula — dissolves the CapitalGlobe into an
 * expanding cosmic explosion of nebula clouds, gradient streaks, and
 * volumetric light shafts as the user scrolls into the spacer section.
 *
 * Scroll bands (contact page has only two content sections):
 *   0.00–0.18 → CapitalGlobe fully visible
 *   0.14–0.35 → crossfade: globe fades, nebula rises
 *   0.35–1.00 → nebula fully dominates
 */
export default function ContactNebula({ theme }: Props) {
  const groupRef  = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Points>(null);
  const cloud2Ref = useRef<THREE.Points>(null);
  const streakRef = useRef<THREE.Points>(null);
  const ringRefs  = useRef<THREE.Mesh[]>([]);

  const isDark = theme === 'dark';

  // ── Cloud layer 1 — dense core, coral→magenta→violet ──────────────────
  const cloud1Geo = useMemo(() => {
    const geo  = new THREE.BufferGeometry();
    const pos  = new Float32Array(CLOUD_COUNT * 3);
    const col  = new Float32Array(CLOUD_COUNT * 3);
    for (let i = 0; i < CLOUD_COUNT; i++) {
      // Spiral arms — two-arm galaxy with height spread
      const arm    = i % 3;
      const armOff = arm * ((Math.PI * 2) / 3);
      const r      = Math.pow(Math.random(), 0.5) * 8.5 + 0.3;
      const spin   = r * 0.22;
      const angle  = Math.random() * Math.PI * 2 + spin + armOff;
      const hy     = (Math.random() - 0.5) * 2.2 * (1 - Math.min(r / 9, 1));

      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = hy;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      // Coral (#E44C3A) → Magenta (#C24193) → Deep Violet (#6B4BA1)
      const t = Math.min(r / 8.5, 1);
      col[i * 3]     = THREE.MathUtils.lerp(0.894, 0.420, t);  // R: coral→violet
      col[i * 3 + 1] = THREE.MathUtils.lerp(0.298, 0.294, t);  // G: stays low
      col[i * 3 + 2] = THREE.MathUtils.lerp(0.227, 0.631, t);  // B: low→violet
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  // ── Cloud layer 2 — wider halo, warm pink → deep blue ─────────────────
  const cloud2Geo = useMemo(() => {
    const count = 1400;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = Math.random() * 13 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.45;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Hot pink → indigo outer halo
      const t = Math.min((r - 2) / 11, 1);
      col[i * 3]     = THREE.MathUtils.lerp(0.96, 0.28, t);
      col[i * 3 + 1] = THREE.MathUtils.lerp(0.40, 0.20, t);
      col[i * 3 + 2] = THREE.MathUtils.lerp(0.72, 0.82, t);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  // ── Streak / filament layer — thin bright threads ─────────────────────
  const streakGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(STREAK_COUNT * 3);
    for (let i = 0; i < STREAK_COUNT; i++) {
      const r     = Math.random() * 10 + 1;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // ── Expanding concentric rings ─────────────────────────────────────────
  const ringGeos = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) => {
      const r = 1.8 + i * 1.6;
      return new THREE.RingGeometry(r, r + 0.06, 128);
    }),
  []);

  // ── Volumetric beam data ───────────────────────────────────────────────
  const beamData = useMemo(() =>
    Array.from({ length: BEAM_COUNT }, (_, i) => ({
      x:     (i / (BEAM_COUNT - 1) - 0.5) * 16,
      phase: (i / BEAM_COUNT) * Math.PI * 2,
      color: [
        '#E44C3A', '#C24193', '#BE3D92',
        '#6B4BA1', '#C24193', '#E44C3A',
        '#9B2335', '#BE3D92',
      ][i],
    })),
  []);

  const opRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    // Fade in as globe fades, stay full for rest of page
    const target = ss(0.14, 0.36, sp);
    opRef.current += (target - opRef.current) * 0.048;
    const op = opRef.current;

    groupRef.current.visible = op > 0.008;
    if (!groupRef.current.visible) return;

    // Slow majestic rotation
    groupRef.current.rotation.y = t * 0.028 + sp * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.035) * 0.08;

    // Cloud 1 — pulsing size, slow drift
    if (cloud1Ref.current) {
      const m = cloud1Ref.current.material as THREE.PointsMaterial;
      m.opacity = (isDark ? 0.82 : 0.68) * op;
      m.size    = 0.062 + Math.sin(t * 0.38) * 0.012;
    }

    // Cloud 2 — outer halo, dimmer
    if (cloud2Ref.current) {
      const m = cloud2Ref.current.material as THREE.PointsMaterial;
      m.opacity = (isDark ? 0.48 : 0.36) * op;
      m.size    = 0.038 + Math.sin(t * 0.55 + 1.2) * 0.008;
      cloud2Ref.current.rotation.y = -t * 0.018;
    }

    // Streaks — bright, fast shimmer
    if (streakRef.current) {
      const m = streakRef.current.material as THREE.PointsMaterial;
      m.opacity = (0.55 + Math.sin(t * 1.8) * 0.25) * op;
      m.size    = 0.022 + Math.sin(t * 2.1) * 0.006;
    }

    // Concentric rings — breathe in/out
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const m = ring.material as THREE.MeshBasicMaterial;
      const phase = (i / RING_COUNT) * Math.PI;
      m.opacity = (0.12 + 0.08 * Math.sin(t * 0.7 + phase)) * op;
      ring.rotation.z = t * (0.04 + i * 0.008);
      ring.rotation.x = Math.sin(t * 0.05 + phase) * 0.3;
    });
  });

  // Ring colours cycling through brand palette
  const RING_COLORS = ['#E44C3A', '#C24193', '#BE3D92', '#6B4BA1', '#9B2335'];

  return (
    <group ref={groupRef} visible={false}>
      {/* Dense spiral nebula cloud */}
      <points ref={cloud1Ref} geometry={cloud1Geo}>
        <pointsMaterial
          size={0.062}
          vertexColors
          transparent
          opacity={isDark ? 0.82 : 0.68}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Outer halo cloud */}
      <points ref={cloud2Ref} geometry={cloud2Geo}>
        <pointsMaterial
          size={0.038}
          vertexColors
          transparent
          opacity={isDark ? 0.48 : 0.36}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bright filament streaks */}
      <points ref={streakRef} geometry={streakGeo}>
        <pointsMaterial
          size={0.022}
          color={isDark ? '#f0abfc' : '#be185d'}
          transparent
          opacity={isDark ? 0.6 : 0.48}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Concentric pulsing rings */}
      {ringGeos.map((geo, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          geometry={geo}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color={RING_COLORS[i]}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Volumetric light beams rising through the nebula */}
      {beamData.map(({ x, phase, color }, i) => (
        <mesh
          key={i}
          position={[x, 0, -1.5 - i * 0.3]}
          rotation={[0, phase * 0.15, 0]}
        >
          <cylinderGeometry args={[0.04, 0.28, 22, 6, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.045}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
