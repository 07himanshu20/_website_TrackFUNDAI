'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';

interface Props {
  theme: 'dark' | 'light';
}

/**
 * Scroll-driven CapitalGlobe for the About page.
 * At scroll=0  → positioned far right (+6 X) and slightly behind
 * At scroll≈0.35 → rolls to center (0, 0, 0), glowing at full intensity
 * Stays centered through the rest of the mission/principles sections.
 * Fades out as the timeline section begins (~scroll 0.52+).
 */
export default function AboutGlobe({ theme }: Props) {
  const groupRef  = useRef<THREE.Group>(null);
  const wireRef   = useRef<THREE.Mesh>(null);
  const dotsRef   = useRef<THREE.Points>(null);
  const arcRefs   = useRef<(THREE.Mesh | null)[]>([]);

  const HUBS = useMemo(() => [
    { lat: 19.07,  lon: 72.87  },  // Mumbai
    { lat: 40.71,  lon: -74.0  },  // NYC
    { lat: 51.5,   lon: -0.13  },  // London
    { lat: 22.3,   lon: 114.17 },  // Hong Kong
    { lat: 1.35,   lon: 103.82 },  // Singapore
    { lat: 35.68,  lon: 139.69 },  // Tokyo
    { lat: 25.2,   lon: 55.27  },  // Dubai
    { lat: -33.87, lon: 151.21 },  // Sydney
  ], []);

  const RADIUS = 2.8;

  const latLonToVec = (lat: number, lon: number, r = RADIUS) => {
    const phi   = (90 - lat)  * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    );
  };

  const dotGeo = useMemo(() => {
    const count = 480;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pos[i * 3]     = RADIUS * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = RADIUS * Math.cos(phi);
      pos[i * 3 + 2] = RADIUS * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const arcTubes = useMemo(() => {
    const pairs: [number, number][] = [
      [0, 1], [0, 2], [1, 2], [0, 3], [3, 4],
      [2, 6], [4, 5], [1, 5], [0, 6], [3, 7],
    ];
    return pairs.map(([a, b]) => {
      const va  = latLonToVec(HUBS[a].lat, HUBS[a].lon);
      const vb  = latLonToVec(HUBS[b].lat, HUBS[b].lon);
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(RADIUS + va.distanceTo(vb) * 0.4);
      return new THREE.TubeGeometry(
        new THREE.QuadraticBezierCurve3(va, mid, vb), 48, 0.016, 8, false,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HUBS]);

  // Smooth refs for position / opacity — updated in useFrame only
  const smooth = useRef({ x: 6.5, opacity: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const t  = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    // smoothstep helper
    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    // Target X: start far right (6.5), arrive at 0 by sp=0.28
    const targetX = 6.5 * (1 - ss(0.0, 0.28, sp));
    // Opacity: fade in as globe enters, fade out as timeline starts
    const fadeIn  = ss(0.0, 0.12, sp);
    const fadeOut = 1 - ss(0.50, 0.62, sp);
    const targetOpacity = fadeIn * fadeOut;

    // Lerp smoothly
    smooth.current.x       += (targetX       - smooth.current.x)       * 0.05;
    smooth.current.opacity += (targetOpacity - smooth.current.opacity) * 0.06;

    const op = smooth.current.opacity;
    groupRef.current.position.x = smooth.current.x;
    groupRef.current.visible = op > 0.01;
    groupRef.current.scale.setScalar(op > 0.01 ? 1 : 0);

    // Slow self-rotation + rolling effect while moving
    const rollSpeed = Math.abs(targetX - smooth.current.x) * 0.3;
    groupRef.current.rotation.y = t * 0.07 + sp * 0.8;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.1 + rollSpeed * 0.05;

    if (wireRef.current) {
      const m = wireRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (theme === 'dark' ? 0.22 : 0.30) * op;
    }
    if (dotsRef.current) {
      const m = dotsRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.80 : 0.70) * op;
      m.size = 0.045 + Math.sin(t * 0.5) * 0.006;
    }
    arcRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const m = mesh.material as THREE.MeshBasicMaterial;
      m.opacity = (0.55 + Math.sin(t * 1.4 + i * 0.8) * 0.35) * op;
    });
  });

  const isDark   = theme === 'dark';
  const wireColor = isDark ? '#a78bfa' : '#6d28d9';
  const dotColor  = isDark ? '#c4b5fd' : '#7c3aed';
  const arcColor  = isDark ? '#f0abfc' : '#be185d';
  const hubColor  = isDark ? '#fbbf77' : '#c2410c';

  return (
    <group ref={groupRef} position={[6.5, 0, 0]}>
      {/* Wireframe sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[RADIUS, 36, 36]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={isDark ? 0.22 : 0.30} />
      </mesh>

      {/* Surface dot field */}
      <points ref={dotsRef} geometry={dotGeo}>
        <pointsMaterial
          size={0.045}
          color={dotColor}
          transparent
          opacity={isDark ? 0.80 : 0.70}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS + 0.06, RADIUS + 0.10, 128]} />
        <meshBasicMaterial color={wireColor} transparent opacity={isDark ? 0.40 : 0.50} side={THREE.DoubleSide} />
      </mesh>

      {/* Hub markers */}
      {HUBS.map((hub, i) => {
        const v = latLonToVec(hub.lat, hub.lon, RADIUS + 0.04);
        return (
          <mesh key={i} position={v}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshBasicMaterial color={hubColor} transparent opacity={0.95} />
          </mesh>
        );
      })}

      {/* Arc connections */}
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
