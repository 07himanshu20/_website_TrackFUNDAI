'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import NeuralCore from './NeuralCore';
import CapitalGlobe from './CapitalGlobe';
import DataNebula from './DataNebula';
import CrystalLattice from './CrystalLattice';
import AmbientStars from './AmbientStars';
import AboutScene from './AboutScene';
import SolutionsScene from './SolutionsScene';

interface Props {
  theme: 'dark' | 'light';
  pathname: string;
}

function Lights({ theme }: { theme: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 1.1} />
      <pointLight position={[8, 6, 8]}   intensity={isDark ? 1.2 : 1.8} color={isDark ? '#a78bfa' : '#6d28d9'} />
      <pointLight position={[-8, -4, 4]} intensity={isDark ? 0.7 : 0.9} color={isDark ? '#f0abfc' : '#be185d'} />
      <pointLight position={[0, -8, 4]}  intensity={isDark ? 0.45 : 0.65} color={isDark ? '#fbbf77' : '#c2410c'} />
    </>
  );
}

function CameraDrift() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    target.current.set(
      Math.sin(t * 0.12) * 0.5,
      sp * 0.8 - 0.15,
      8 - sp * 1.8,
    );
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Shared mutable visibility bag — written by HomeMorph, read by SceneA/B/C/D.
 * Using a ref object avoids React re-renders while still being a stable reference.
 */
type VisBag = { a: number; b: number; c: number; d: number };

/**
 * Thin wrappers that read from the shared VisBag ref each frame
 * and pass it to the underlying scene as `visibility`.
 * This is the ONLY place visibility is applied — the children never override it.
 */
function SceneA({ theme, vis }: { theme: 'dark'|'light'; vis: React.MutableRefObject<VisBag> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const v = vis.current.a;
    ref.current.visible = v > 0.005;
  });
  // NeuralCore reads `visibility` prop each frame and applies it to opacity/scale
  return <group ref={ref}><NeuralCore theme={theme} visibility={0} visRef={vis} visKey="a" /></group>;
}

function SceneB({ theme, vis }: { theme: 'dark'|'light'; vis: React.MutableRefObject<VisBag> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.visible = vis.current.b > 0.005;
  });
  return <group ref={ref}><CapitalGlobe theme={theme} visibility={0} visRef={vis} visKey="b" /></group>;
}

function SceneC({ theme, vis }: { theme: 'dark'|'light'; vis: React.MutableRefObject<VisBag> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.visible = vis.current.c > 0.005;
  });
  return <group ref={ref}><DataNebula theme={theme} visibility={0} visRef={vis} visKey="c" /></group>;
}

function SceneD({ theme, vis }: { theme: 'dark'|'light'; vis: React.MutableRefObject<VisBag> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.visible = vis.current.d > 0.005;
  });
  return <group ref={ref}><CrystalLattice theme={theme} visibility={0} visRef={vis} visKey="d" /></group>;
}

/**
 * Computes smoothstep crossfade values each frame and writes into the shared VisBag.
 * Scroll bands:
 *   0.00–0.22  → NeuralCore   (hero)
 *   0.22–0.48  → CapitalGlobe (global finance)
 *   0.48–0.72  → DataNebula   (market intelligence)
 *   0.72–1.00  → CrystalLattice (architecture)
 *
 * No lerp smoothing on top — the scenes already lerp internally.
 * Using hard smoothstep gives a crisp crossfade without the slow "ghost" overlap.
 */
function VisBagWriter({ vis }: { vis: React.MutableRefObject<VisBag> }) {
  useFrame(() => {
    const sp = scrollStore.progress;
    const ss = (e0: number, e1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    // Hard crossfade — no extra lerp, each scene gets clean exclusive visibility
    vis.current.a = 1 - ss(0.18, 0.28, sp);
    vis.current.b = ss(0.20, 0.30, sp) * (1 - ss(0.44, 0.52, sp));
    vis.current.c = ss(0.46, 0.54, sp) * (1 - ss(0.65, 0.73, sp));
    vis.current.d = ss(0.67, 0.76, sp);
  });
  return null;
}

function HomeMorph({ theme }: { theme: 'dark' | 'light' }) {
  const vis = useRef<VisBag>({ a: 1, b: 0, c: 0, d: 0 });

  return (
    <>
      <VisBagWriter vis={vis} />
      <SceneA theme={theme} vis={vis} />
      <SceneB theme={theme} vis={vis} />
      <SceneC theme={theme} vis={vis} />
      <SceneD theme={theme} vis={vis} />
    </>
  );
}

function PageScene({ pathname, theme }: { pathname: string; theme: 'dark' | 'light' }) {
  if (pathname === '/')          return <HomeMorph theme={theme} />;
  if (pathname === '/about')     return <AboutScene theme={theme} />;
  if (pathname === '/solutions')  return <SolutionsScene theme={theme} />;
  if (pathname === '/insights')   return <DataNebula   theme={theme} visibility={1} />;
  if (pathname === '/contact')    return <CapitalGlobe theme={theme} visibility={1} />;
  return <NeuralCore theme={theme} visibility={1} />;
}

export default function Scene({ theme, pathname }: Props) {
  return (
    <div className="scene-canvas">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lights theme={theme} />
          <AmbientStars theme={theme} count={700} />
          {(pathname === '/' || pathname === '/about' || pathname === '/solutions') && <CameraDrift />}
          <PageScene pathname={pathname} theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  );
}
