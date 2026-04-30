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

export default function NeuralCore({ theme, visibility = 1, visRef, visKey }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const NODE_COUNT = 120;

  const { nodeGeo, lineGeo } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    // Fibonacci sphere — evenly distributed nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.8 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(theta);

      // Gradient: core purple → outer magenta
      const t = Math.random();
      nodeColors[i * 3] = THREE.MathUtils.lerp(0.6, 0.95, t);
      nodeColors[i * 3 + 1] = THREE.MathUtils.lerp(0.55, 0.67, t);
      nodeColors[i * 3 + 2] = THREE.MathUtils.lerp(0.98, 0.98, 1 - t);
    }

    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    nGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Connect nearby nodes
    const lv: number[] = [];
    const threshold = 1.9;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
          lv.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          lv.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lv), 3));

    return { nodeGeo: nGeo, lineGeo: lGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollStore.progress;

    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.09;
      innerRef.current.rotation.x = Math.sin(t * 0.055) * 0.18;
    }

    // Scroll drift + breathing scale
    // In hero (sp≈0) shift right so globe occupies right half; lerp back to center as user scrolls
    const ss = (e0: number, e1: number, x: number) => {
      const c = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };
    const targetX = 2.2 * (1 - ss(0.0, 0.20, sp));
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y = -sp * 1.2;
    // Read live visibility from shared ref (HomeMorph) or fall back to prop
    const vis = visRef && visKey ? visRef.current[visKey] : visibility;
    const breathe = 0.9 + Math.sin(t * 0.45) * 0.06;
    groupRef.current.scale.setScalar(vis * breathe);
    groupRef.current.visible = vis > 0.005;

    // Counter-rotating rings
    if (ringARef.current) {
      ringARef.current.rotation.x = t * 0.11;
      ringARef.current.rotation.y = t * 0.13;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.x = -t * 0.08;
      ringBRef.current.rotation.z = t * 0.1;
    }
    if (ringCRef.current) {
      ringCRef.current.rotation.y = t * 0.06;
      ringCRef.current.rotation.z = -t * 0.09;
    }

    // Pulsing core
    if (pulseRef.current) {
      const pulse = 0.55 + Math.sin(t * 1.8) * 0.2;
      pulseRef.current.scale.setScalar(pulse);
      const m = pulseRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (theme === 'dark' ? 0.55 : 0.45) * pulse * vis;
    }

    if (linesRef.current) {
      const m = linesRef.current.material as THREE.LineBasicMaterial;
      m.opacity = (theme === 'dark' ? 0.55 : 0.45) * vis;
    }
    if (pointsRef.current) {
      const m = pointsRef.current.material as THREE.PointsMaterial;
      m.opacity = (theme === 'dark' ? 0.95 : 0.85) * vis;
      m.size = 0.11 + Math.sin(t * 1.2) * 0.018;
    }
  });

  const isDark = theme === 'dark';
  const lineColor = isDark ? '#a78bfa' : '#6d28d9';
  const ringColor = isDark ? '#f0abfc' : '#be185d';
  const coreColor = isDark ? '#c4b5fd' : '#7c3aed';
  const glowColor = isDark ? '#fbbf77' : '#c2410c';

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        <lineSegments ref={linesRef} geometry={lineGeo}>
          <lineBasicMaterial color={lineColor} transparent opacity={isDark ? 0.55 : 0.45} depthWrite={false} />
        </lineSegments>

        <points ref={pointsRef} geometry={nodeGeo}>
          <pointsMaterial
            size={0.11}
            vertexColors
            transparent
            opacity={isDark ? 0.95 : 0.85}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Pulsing core sphere */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.7, 28, 28]} />
          <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.55 : 0.45} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshBasicMaterial color={coreColor} transparent opacity={isDark ? 0.75 : 0.65} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Three counter-rotating orbit rings */}
      <mesh ref={ringARef}>
        <torusGeometry args={[3.6, 0.018, 10, 120]} />
        <meshBasicMaterial color={ringColor} transparent opacity={isDark ? 0.5 : 0.4} />
      </mesh>
      <mesh ref={ringBRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.15, 0.013, 10, 100]} />
        <meshBasicMaterial color={coreColor} transparent opacity={isDark ? 0.42 : 0.35} />
      </mesh>
      <mesh ref={ringCRef} rotation={[0, Math.PI / 4, Math.PI / 5]}>
        <torusGeometry args={[2.8, 0.01, 8, 80]} />
        <meshBasicMaterial color={glowColor} transparent opacity={isDark ? 0.32 : 0.28} />
      </mesh>
    </group>
  );
}
