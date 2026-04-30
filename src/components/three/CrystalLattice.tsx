'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';

type VisBag = { a: number; b: number; c: number; d: number };

interface Props {
  theme: 'dark' | 'light';
  visibility?: number;
  visRef?: React.MutableRefObject<VisBag>;
  visKey?: keyof VisBag;
}

export default function CrystalLattice({ theme, visibility = 1, visRef, visKey }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const particleRef = useRef<THREE.Points>(null);

  const SHAPES = useMemo(
    () => [
      { type: 'octa' as const,  pos: [-3.4, 1.6, -1.0] as [number,number,number],  scale: 1.1,  speed: 0.18 },
      { type: 'icosa' as const, pos: [3.8,  -0.8, -1.8] as [number,number,number],  scale: 1.3,  speed: 0.13 },
      { type: 'octa' as const,  pos: [-2.2, -2.6,  0.6] as [number,number,number],  scale: 0.85, speed: 0.22 },
      { type: 'icosa' as const, pos: [2.8,   2.8, -0.6] as [number,number,number],  scale: 1.0,  speed: 0.16 },
      { type: 'tetra' as const, pos: [0.0,   0.0, -2.8] as [number,number,number],  scale: 1.5,  speed: 0.10 },
      { type: 'octa' as const,  pos: [-4.2,  0.2, -3.2] as [number,number,number],  scale: 0.75, speed: 0.25 },
      { type: 'icosa' as const, pos: [4.4,   1.4, -2.8] as [number,number,number],  scale: 0.8,  speed: 0.20 },
      { type: 'tetra' as const, pos: [-1.0,  3.2, -1.5] as [number,number,number],  scale: 0.65, speed: 0.28 },
      { type: 'octa' as const,  pos: [1.4,  -3.0, -1.0] as [number,number,number],  scale: 0.72, speed: 0.19 },
    ],
    [],
  );

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const lineGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(3.5, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  // Ambient particle dust
  const particleGeo = useMemo(() => {
    const count = 600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distributed in a sphere shell around the scene
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const vis = visRef && visKey ? visRef.current[visKey] : visibility;
    const breathe = 0.92 + Math.sin(t * 0.35) * 0.05;
    groupRef.current.scale.setScalar(vis * breathe);
    groupRef.current.visible = vis > 0.005;

    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.07 + sp * 0.3;
      innerRef.current.rotation.x = Math.sin(t * 0.04) * 0.14;
    }

    meshRefs.current.forEach((m, i) => {
      if (!m || i >= SHAPES.length) return;
      const s = SHAPES[i];
      m.rotation.x = t * s.speed;
      m.rotation.y = t * s.speed * 1.5;
      m.position.y = s.pos[1] + Math.sin(t * 0.45 + i * 1.1) * 0.3;
      // Pulse scale
      const pulse = 1 + Math.sin(t * 0.9 + i * 0.7) * 0.08;
      m.scale.setScalar(s.scale * pulse);
    });

    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = (theme === 'dark' ? 0.38 : 0.45) * vis;
    }

    if (particleRef.current) {
      particleRef.current.rotation.y = t * 0.018;
      const m = particleRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.5 : 0.45) * vis;
    }
  });

  const isDark = theme === 'dark';
  const latticeColor = isDark ? '#a78bfa' : '#6d28d9';
  const meshColor    = isDark ? '#c4b5fd' : '#7c3aed';
  const accentColor  = isDark ? '#f0abfc' : '#be185d';
  const warmColor    = isDark ? '#fbbf77' : '#c2410c';

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        {/* Lattice wireframe */}
        <lineSegments ref={linesRef} geometry={lineGeo}>
          <lineBasicMaterial color={latticeColor} transparent opacity={isDark ? 0.38 : 0.45} depthWrite={false} />
        </lineSegments>

        {/* Floating prisms */}
        {SHAPES.map((s, i) => (
          <mesh
            key={i}
            ref={(el) => { meshRefs.current[i] = el; }}
            position={s.pos}
            scale={s.scale}
          >
            {s.type === 'octa'  && <octahedronGeometry  args={[0.6, 0]} />}
            {s.type === 'icosa' && <icosahedronGeometry args={[0.55, 0]} />}
            {s.type === 'tetra' && <tetrahedronGeometry args={[0.62, 0]} />}
            <meshBasicMaterial
              color={i % 3 === 0 ? accentColor : i % 3 === 1 ? meshColor : warmColor}
              wireframe
              transparent
              opacity={(isDark ? 0.75 : 0.65) * visibility}
            />
          </mesh>
        ))}

        {/* Inner pulsing core */}
        <mesh>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshBasicMaterial color={accentColor} transparent opacity={(isDark ? 0.35 : 0.3) * visibility} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.25, 14, 14]} />
          <meshBasicMaterial color={meshColor} transparent opacity={(isDark ? 0.65 : 0.55) * visibility} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Ambient particle cloud */}
      <points ref={particleRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.03}
          color={latticeColor}
          transparent
          opacity={isDark ? 0.5 : 0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
