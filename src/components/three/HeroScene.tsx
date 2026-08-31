"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Sizes the renderer directly from the canvas's parent. R3F's ResizeObserver
 * can report 0 when the canvas lazy-mounts behind the intro curtain; measuring
 * the parent explicitly is deterministic and event-free.
 */
function SizeToParent() {
  const gl = useThree((s) => s.gl);
  const setSize = useThree((s) => s.setSize);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;

    const sync = () => {
      if (parent.clientWidth > 0 && parent.clientHeight > 0) {
        setSize(parent.clientWidth, parent.clientHeight);
      }
    };

    // ResizeObserver fires immediately on observe (and again once the element
    // gains a real size), so this catches the behind-the-curtain 0 case.
    const observer = new ResizeObserver(sync);
    observer.observe(parent);
    sync();

    return () => observer.disconnect();
  }, [gl, setSize]);

  return null;
}

/**
 * A drifting field of points with subtle mouse parallax. Deliberately cheap:
 * one BufferGeometry, additive points, capped DPR. No per-frame allocations.
 */
function ParticleField({ count = 2200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Cluster toward the center, thin out to the edges.
      const r = Math.pow(Math.random(), 0.6) * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const d = Math.min(delta, 0.05); // clamp on tab refocus
    p.rotation.y += d * 0.03;
    p.rotation.x += d * 0.008;
    // Ease rotation toward the pointer for parallax.
    const targetY = state.pointer.x * 0.35;
    const targetX = -state.pointer.y * 0.25;
    p.rotation.y += (targetY - p.rotation.y % (Math.PI * 2)) * d * 0.4;
    p.rotation.x += (targetX - p.rotation.x) * d * 0.6;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color="#a97fe0"
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  // Gentle camera sway so the field feels alive even when idle.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.1) * 0.3;
    state.camera.position.y = Math.cos(t * 0.13) * 0.2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SizeToParent />
      <ParticleField />
      <Rig />
    </Canvas>
  );
}
