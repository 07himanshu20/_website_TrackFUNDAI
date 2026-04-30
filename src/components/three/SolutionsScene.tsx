'use client';

/**
 * SolutionsScene — full-page cinematic backdrop for the Solutions page.
 *
 * Scroll bands drive color + motion changes:
 *   0.00–0.30  → deep violet nebula, slow drift (Hero + Modules top)
 *   0.30–0.60  → teal-green northern lights, active ripple (Modules mid)
 *   0.60–0.85  → magenta-gold aurora, fast pulse (Tech Stack)
 *   0.85–1.00  → meteor shower + deep indigo (CTA)
 *
 * All animation is imperative useFrame — zero React state changes per frame.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import MeteorShower from './MeteorShower';

// ─── Types ────────────────────────────────────────────────────

interface Curtain {
  line:  THREE.Line;
  mat:   THREE.LineBasicMaterial;
  geo:   THREE.BufferGeometry;
  xPos:  number;
  phase: number;
  speed: number;
  band:  number; // 0=violet, 1=teal, 2=gold
}

// ─── Helpers ──────────────────────────────────────────────────

const ss = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Lerp between two hex colors by t (0→1)
const lerpCol = (a: THREE.Color, b: THREE.Color, t: number, out: THREE.Color) => {
  out.r = a.r + (b.r - a.r) * t;
  out.g = a.g + (b.g - a.g) * t;
  out.b = a.b + (b.b - a.b) * t;
};

// ─── Nebula cloud component ────────────────────────────────────

function NebulaClouds({ isDark }: { isDark: boolean }) {
  const groupRef  = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Points>(null);
  const cloud2Ref = useRef<THREE.Points>(null);
  const cloud3Ref = useRef<THREE.Points>(null);

  // Three overlapping particle clouds at different depths/sizes
  const [geo1, geo2, geo3] = useMemo(() => {
    const make = (count: number, spread: number, zOff: number) => {
      const geo    = new THREE.BufferGeometry();
      const pos    = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r    = Math.pow(Math.random(), 0.4) * spread;
        const phi  = Math.random() * Math.PI * 2;
        const elev = (Math.random() - 0.5) * spread * 0.5;
        pos[i * 3]     = Math.cos(phi) * r + (Math.random() - 0.5) * 2;
        pos[i * 3 + 1] = elev;
        pos[i * 3 + 2] = Math.sin(phi) * r * 0.4 + zOff;
        // start violet
        colors[i * 3]     = 0.65 + Math.random() * 0.25;
        colors[i * 3 + 1] = 0.20 + Math.random() * 0.25;
        colors[i * 3 + 2] = 0.90 + Math.random() * 0.10;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
      return geo;
    };
    return [make(1200, 9, -4), make(800, 6, -6), make(600, 5, -8)];
  }, []);

  // Palette per scroll band
  const palettes = useMemo(() => [
    // band 0 — deep violet
    { c1: new THREE.Color('#8b5cf6'), c2: new THREE.Color('#a855f7'), c3: new THREE.Color('#c084fc') },
    // band 1 — teal-green
    { c1: new THREE.Color('#06b6d4'), c2: new THREE.Color('#10b981'), c3: new THREE.Color('#34d399') },
    // band 2 — magenta-gold
    { c1: new THREE.Color('#f0abfc'), c2: new THREE.Color('#fbbf24'), c3: new THREE.Color('#f472b6') },
    // band 3 — indigo-blue (CTA)
    { c1: new THREE.Color('#4f46e5'), c2: new THREE.Color('#6366f1'), c3: new THREE.Color('#818cf8') },
  ], []);

  const tmpCol = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    // Slow drift of the whole nebula
    groupRef.current.rotation.y = t * 0.012;
    groupRef.current.rotation.x = Math.sin(t * 0.007) * 0.06;
    groupRef.current.position.y = Math.sin(t * 0.08) * 0.15;

    // Band weights
    const w0 = 1 - ss(0.20, 0.35, sp);
    const w1 = ss(0.25, 0.38, sp) * (1 - ss(0.52, 0.65, sp));
    const w2 = ss(0.58, 0.70, sp) * (1 - ss(0.80, 0.90, sp));
    const w3 = ss(0.82, 0.92, sp);

    // Dominant band
    const dom = w0 > 0.5 ? 0 : w1 > 0.5 ? 1 : w2 > 0.5 ? 2 : 3;
    const next = Math.min(dom + 1, 3);
    const blend = dom === 0 ? ss(0.20, 0.35, sp)
                : dom === 1 ? ss(0.52, 0.65, sp)
                : dom === 2 ? ss(0.80, 0.90, sp) : 0;

    const setMat = (
      ref: React.MutableRefObject<THREE.Points | null>,
      pal1: THREE.Color,
      pal2: THREE.Color,
      baseOp: number,
      size: number,
    ) => {
      if (!ref.current) return;
      const m = ref.current.material as THREE.PointsMaterial;
      lerpCol(pal1, pal2, blend, tmpCol);
      m.color.copy(tmpCol);
      m.opacity = baseOp * (isDark ? 1 : 0.55);
      m.size    = size + Math.sin(t * 0.4) * size * 0.12;
    };

    setMat(cloud1Ref, palettes[dom].c1, palettes[next].c1, 0.55, 0.12);
    setMat(cloud2Ref, palettes[dom].c2, palettes[next].c2, 0.40, 0.08);
    setMat(cloud3Ref, palettes[dom].c3, palettes[next].c3, 0.30, 0.06);
  });

  return (
    <group ref={groupRef}>
      <points ref={cloud1Ref} geometry={geo1}>
        <pointsMaterial vertexColors={false} size={0.12} transparent opacity={0.55}
          sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={cloud2Ref} geometry={geo2}>
        <pointsMaterial vertexColors={false} size={0.08} transparent opacity={0.40}
          sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={cloud3Ref} geometry={geo3}>
        <pointsMaterial vertexColors={false} size={0.06} transparent opacity={0.30}
          sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ─── Aurora Curtains ───────────────────────────────────────────

const CURTAIN_COUNT = 18;

function AuroraCurtains({ isDark }: { isDark: boolean }) {
  const SEG = 56;

  // Palette: 3 bands × 3 colors each
  const bandCols = useMemo(() => ({
    0: ['#8b5cf6', '#a855f7', '#c084fc', '#7c3aed', '#6d28d9', '#4c1d95'],
    1: ['#06b6d4', '#10b981', '#34d399', '#0ea5e9', '#22d3ee', '#6ee7b7'],
    2: ['#f0abfc', '#fbbf24', '#f472b6', '#e879f9', '#facc15', '#fb7185'],
    3: ['#4f46e5', '#6366f1', '#818cf8', '#3730a3', '#4338ca', '#a5b4fc'],
  } as Record<number, string[]>), []);

  const curtains = useMemo<Curtain[]>(() => (
    Array.from({ length: CURTAIN_COUNT }, (_, ci) => {
      const band = ci % 4;
      const cols = bandCols[band];
      const colorStr = cols[ci % cols.length];

      const pos = new Float32Array((SEG + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.LineBasicMaterial({
        color: colorStr,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        linewidth: 1,
      });

      return {
        line: new THREE.Line(geo, mat),
        mat, geo,
        xPos: -14 + (ci / (CURTAIN_COUNT - 1)) * 28,
        phase: Math.random() * Math.PI * 2,
        speed: 0.14 + Math.random() * 0.28,
        band,
      };
    })
  ), [bandCols]);

  useFrame((state) => {
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    // Band visibility by scroll
    const bv: Record<number, number> = {
      0: 1 - ss(0.22, 0.38, sp),
      1: ss(0.28, 0.42, sp) * (1 - ss(0.56, 0.70, sp)),
      2: ss(0.62, 0.75, sp) * (1 - ss(0.82, 0.92, sp)),
      3: ss(0.84, 0.94, sp),
    };

    // Speed multiplier increases with scroll (more kinetic at bottom)
    const speedMult = 1 + sp * 2.5;

    curtains.forEach((c) => {
      const posAttr = c.geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const v = bv[c.band] ?? 0;

      for (let s = 0; s <= SEG; s++) {
        const frac = s / SEG;
        const y = -5 + frac * 12;

        // Right-side emergence: curtains on the right have xPos > 0
        // They animate in from x=+infinity side
        const emergeShift = c.xPos > 0 ? (1 - v) * 8 : 0;

        const ripple =
          Math.sin(frac * Math.PI * 3.5 + t * c.speed * speedMult + c.phase) * 0.70 +
          Math.sin(frac * Math.PI * 6   + t * c.speed * speedMult * 0.6 + c.phase * 1.4) * 0.30 +
          Math.sin(frac * Math.PI * 1.2 + t * c.speed * speedMult * 0.3) * 0.20;

        arr[s * 3]     = c.xPos + ripple + emergeShift;
        arr[s * 3 + 1] = y;
        arr[s * 3 + 2] = -2 + Math.sin(frac * Math.PI * 1.8 + c.phase + t * 0.06) * 1.5;
      }
      posAttr.needsUpdate = true;

      const pulse = 0.5 + 0.5 * Math.sin(t * c.speed * 0.7 + c.phase);
      const baseOp = isDark
        ? (c.band === 0 ? 0.72 : c.band === 1 ? 0.68 : c.band === 2 ? 0.75 : 0.65)
        : 0.38;
      c.mat.opacity = v * baseOp * (0.55 + 0.45 * pulse);
    });
  });

  return (
    <>
      {curtains.map((c, i) => <primitive key={i} object={c.line} />)}
    </>
  );
}

// ─── Studio light shafts (right-side emergence) ───────────────

function LightShafts({ isDark }: { isDark: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const shafts = useMemo(() => [
    { w: 2.5, h: 20, x: 8,  z: -3, rotZ: -0.3, band: 0, col: '#8b5cf6' },
    { w: 1.8, h: 18, x: 10, z: -5, rotZ: -0.18, band: 0, col: '#c084fc' },
    { w: 2.2, h: 22, x: 7,  z: -4, rotZ: -0.25, band: 1, col: '#06b6d4' },
    { w: 1.5, h: 16, x: 12, z: -6, rotZ: -0.12, band: 1, col: '#10b981' },
    { w: 2.8, h: 24, x: 9,  z: -3, rotZ: -0.35, band: 2, col: '#f0abfc' },
    { w: 2.0, h: 20, x: 11, z: -5, rotZ: -0.20, band: 2, col: '#fbbf24' },
    { w: 2.0, h: 18, x: 8,  z: -4, rotZ: -0.22, band: 3, col: '#6366f1' },
  ], []);

  const mats = useMemo(() => shafts.map((s) => new THREE.MeshBasicMaterial({
    color: s.col,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })), [shafts]);

  useFrame((state) => {
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const bv = [
      1 - ss(0.22, 0.38, sp),
      ss(0.28, 0.42, sp) * (1 - ss(0.56, 0.70, sp)),
      ss(0.62, 0.75, sp) * (1 - ss(0.82, 0.92, sp)),
      ss(0.84, 0.94, sp),
    ];

    shafts.forEach((s, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const v = bv[s.band];
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.3 + i * 0.8);
      const base = isDark ? 0.055 : 0.028;
      (mesh.material as THREE.MeshBasicMaterial).opacity = v * base * (0.6 + 0.4 * pulse);
      mesh.rotation.z = s.rotZ + Math.sin(t * 0.08 + i) * 0.04;
    });
  });

  return (
    <>
      {shafts.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={[s.x, 0, s.z]}
          rotation={[0, 0, s.rotZ]}
          material={mats[i]}
        >
          <planeGeometry args={[s.w, s.h]} />
        </mesh>
      ))}
    </>
  );
}

// ─── Starfield ────────────────────────────────────────────────

function Stars({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const COUNT = 2000;
    const g   = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -6 - Math.random() * 14;
      const tier = Math.random();
      if (tier < 0.6)       { col[i * 3] = 0.9; col[i * 3 + 1] = 0.9;  col[i * 3 + 2] = 1.0; }
      else if (tier < 0.85) { col[i * 3] = 0.7; col[i * 3 + 1] = 0.5;  col[i * 3 + 2] = 1.0; }
      else                  { col[i * 3] = 1.0; col[i * 3 + 1] = 0.92; col[i * 3 + 2] = 0.8; }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(col,  3));
    return g;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Slow parallax drift
    ref.current.rotation.y = t * 0.006;
    ref.current.rotation.x = Math.sin(t * 0.004) * 0.02;
    const m = ref.current.material as THREE.PointsMaterial;
    m.opacity = isDark ? 0.88 : 0.45;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        vertexColors
        size={0.022}
        transparent
        opacity={isDark ? 0.88 : 0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scroll-gated meteor shower (CTA band only) ───────────────

function CTAMeteors({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null);
  const opRef    = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = ss(0.84, 0.92, scrollStore.progress);
    opRef.current += (target - opRef.current) * 0.06;
    groupRef.current.visible = opRef.current > 0.01;
  });

  return (
    <group ref={groupRef} visible={false}>
      <MeteorShower theme={theme} opacity={opRef.current} />
    </group>
  );
}

// ─── Root export ─────────────────────────────────────────────

export default function SolutionsScene({ theme }: { theme: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  return (
    <>
      <Stars      isDark={isDark} />
      <NebulaClouds isDark={isDark} />
      <AuroraCurtains isDark={isDark} />
      <LightShafts  isDark={isDark} />
      <CTAMeteors   theme={theme} />
    </>
  );
}
