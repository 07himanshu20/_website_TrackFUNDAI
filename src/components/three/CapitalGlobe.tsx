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

export default function CapitalGlobe({ theme, visibility = 1, visRef, visKey }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const dotsRef = useRef<THREE.Points>(null);
  const arcRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Major financial hub coordinates (lat, lon)
  const HUBS = useMemo(
    () => [
      { lat: 19.07, lon: 72.87 },   // Mumbai
      { lat: 40.71, lon: -74.0 },   // NYC
      { lat: 51.5, lon: -0.13 },    // London
      { lat: 22.3, lon: 114.17 },   // Hong Kong
      { lat: 1.35, lon: 103.82 },   // Singapore
      { lat: 35.68, lon: 139.69 },  // Tokyo
      { lat: 25.2, lon: 55.27 },    // Dubai
      { lat: -33.87, lon: 151.21 }, // Sydney
    ],
    [],
  );

  const RADIUS = 2.6;

  const latLonToVec = (lat: number, lon: number, r = RADIUS) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    );
  };

  // Surface dot geometry built entirely in useMemo — no ref access
  const dotGeo = useMemo(() => {
    const count = 420;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pos[i * 3] = RADIUS * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = RADIUS * Math.cos(phi);
      pos[i * 3 + 2] = RADIUS * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // Arc tube geometries built in useMemo
  const arcTubes = useMemo(() => {
    const pairs: [number, number][] = [
      [0, 1], [0, 2], [1, 2], [0, 3], [3, 4], [2, 6], [4, 5], [1, 5], [0, 6], [3, 7],
    ];
    return pairs.map(([a, b]) => {
      const va = latLonToVec(HUBS[a].lat, HUBS[a].lon);
      const vb = latLonToVec(HUBS[b].lat, HUBS[b].lon);
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      const distance = va.distanceTo(vb);
      mid.normalize().multiplyScalar(RADIUS + distance * 0.4);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      return new THREE.TubeGeometry(curve, 48, 0.018, 8, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HUBS]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    const vis = visRef && visKey ? visRef.current[visKey] : visibility;
    groupRef.current.rotation.y = t * 0.09 + sp * 0.5;
    groupRef.current.rotation.x = Math.sin(t * 0.055) * 0.12;
    groupRef.current.scale.setScalar(vis);
    groupRef.current.visible = vis > 0.005;

    if (wireRef.current) {
      const m = wireRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (theme === 'dark' ? 0.22 : 0.3) * vis;
    }
    if (dotsRef.current) {
      const m = dotsRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.75 : 0.65) * vis;
      m.size = 0.04 + Math.sin(t * 0.5) * 0.005;
    }

    arcRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const m = mesh.material as THREE.MeshBasicMaterial;
      m.opacity = (0.55 + Math.sin(t * 1.4 + i * 0.8) * 0.35) * vis;
    });
  });

  const isDark = theme === 'dark';
  const wireColor = isDark ? '#a78bfa' : '#6d28d9';
  const dotColor = isDark ? '#c4b5fd' : '#7c3aed';
  const arcColor = isDark ? '#f0abfc' : '#be185d';
  const hubColor = isDark ? '#fbbf77' : '#c2410c';

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Wireframe sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={isDark ? 0.22 : 0.3} />
      </mesh>

      {/* Surface dot field */}
      <points ref={dotsRef} geometry={dotGeo}>
        <pointsMaterial
          size={0.04}
          color={dotColor}
          transparent
          opacity={isDark ? 0.75 : 0.65}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS + 0.05, RADIUS + 0.08, 120]} />
        <meshBasicMaterial color={wireColor} transparent opacity={isDark ? 0.35 : 0.42} side={THREE.DoubleSide} />
      </mesh>

      {/* Hub markers */}
      {HUBS.map((hub, i) => {
        const v = latLonToVec(hub.lat, hub.lon, RADIUS + 0.03);
        return (
          <mesh key={i} position={v}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={hubColor} transparent opacity={0.9} />
          </mesh>
        );
      })}

      {/* Arc connections between hubs */}
      {arcTubes.map((geo, i) => (
        <mesh
          key={i}
          ref={(el) => { arcRefs.current[i] = el; }}
          geometry={geo}
        >
          <meshBasicMaterial color={arcColor} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}
