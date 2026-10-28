"use client";

/**
 * "Enter the universe": an original information-space. Each station is a distinct
 * geometric "system" orbiting a central core; selecting one flies the camera toward it.
 * Lightweight by design: primitive geometry only, no textures, paused when hidden.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ScenePalette } from "./palette";

export type Station = { id: string; label: string; position: [number, number, number]; shape: "ico" | "torus" | "box" | "octa" | "knot" | "ring" };

function StationMesh({ s, active, visited, palette, onSelect, paused }: { s: Station; active: boolean; visited: boolean; palette: ScenePalette; onSelect: (id: string) => void; paused: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => {
    if (!ref.current || paused) return;
    ref.current.rotation.y += dt * (active ? 0.6 : 0.2);
    ref.current.rotation.x += dt * 0.1;
    const target = active || hover ? 1.25 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });
  const color = active ? palette.cyan : visited ? palette.violet : palette.blue;
  const geo = useMemo(() => {
    switch (s.shape) {
      case "ico": return new THREE.IcosahedronGeometry(0.55, 1);
      case "torus": return new THREE.TorusGeometry(0.45, 0.14, 12, 48);
      case "box": return new THREE.BoxGeometry(0.7, 0.7, 0.7, 2, 2, 2);
      case "octa": return new THREE.OctahedronGeometry(0.6, 0);
      case "knot": return new THREE.TorusKnotGeometry(0.36, 0.11, 80, 10);
      default: return new THREE.TorusGeometry(0.55, 0.03, 8, 64);
    }
  }, [s.shape]);
  return (
    <group position={s.position}>
      <group ref={ref}>
        <mesh
          geometry={geo}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(s.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = "";
          }}
        >
          <meshBasicMaterial color={color} wireframe transparent opacity={active ? 1 : 0.75} />
        </mesh>
      </group>
      {/* halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.93, 64]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.7 : 0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Core({ palette, paused, onSecret }: { palette: ScenePalette; paused: boolean; onSecret: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current && !paused) ref.current.rotation.y += dt * 0.15;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshBasicMaterial color={palette.blue} wireframe transparent opacity={0.25} />
      </mesh>
      {/* easter egg: a tiny node hidden in the core */}
      <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSecret(); }}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={palette.cyan} />
      </mesh>
    </group>
  );
}

function Orbits({ palette, radii }: { palette: ScenePalette; radii: number[] }) {
  return (
    <>
      {radii.map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.008, r + 0.008, 160]} />
          <meshBasicMaterial color={palette.line} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

function Stars({ palette, count }: { palette: ScenePalette; count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) arr.set([(rnd() - 0.5) * 60, (rnd() - 0.5) * 30, (rnd() - 0.5) * 60], i * 3);
    return arr;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={palette.blue} size={0.06} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function CameraRig({ target, paused, reduceMotion }: { target: THREE.Vector3 | null; paused: boolean; reduceMotion: boolean }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    if (paused) return;
    const base = target ? target.clone().multiplyScalar(0.55).add(new THREE.Vector3(0, 1.6, 4.2)) : new THREE.Vector3(0, 5.5, 11);
    const px = reduceMotion ? 0 : state.pointer.x * 1.4;
    const py = reduceMotion ? 0 : state.pointer.y * 0.8;
    const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 2.2);
    camera.position.lerp(base.add(new THREE.Vector3(px, py, 0)), k);
    look.current.lerp(target ?? new THREE.Vector3(), k);
    camera.lookAt(look.current);
  });
  return null;
}

export default function UniverseScene({
  stations,
  activeId,
  visited,
  onSelect,
  onSecret,
  palette,
  paused,
  quality,
  reduceMotion,
}: {
  stations: Station[];
  activeId: string | null;
  visited: Set<string>;
  onSelect: (id: string) => void;
  onSecret: () => void;
  palette: ScenePalette;
  paused: boolean;
  quality: "low" | "high";
  reduceMotion: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);
  const active = stations.find((s) => s.id === activeId);
  const target = active ? new THREE.Vector3(...active.position) : null;
  const radii = [...new Set(stations.map((s) => Math.round(Math.hypot(s.position[0], s.position[2]) * 100) / 100))];

  return (
    <Canvas frameloop={paused || hidden ? "never" : "always"} dpr={quality === "high" ? [1, 1.75] : [1, 1.2]} camera={{ position: [0, 5.5, 11], fov: 50 }} gl={{ antialias: quality === "high", alpha: true }} onPointerMissed={() => onSelect("")}>
      <fog attach="fog" args={[palette.fog, 12, 34]} />
      <CameraRig target={target} paused={paused} reduceMotion={reduceMotion} />
      <Core palette={palette} paused={paused} onSecret={onSecret} />
      <Orbits palette={palette} radii={radii} />
      {stations.map((s) => (
        <StationMesh key={s.id} s={s} active={s.id === activeId} visited={visited.has(s.id)} palette={palette} onSelect={onSelect} paused={paused} />
      ))}
      <Stars palette={palette} count={quality === "high" ? 1200 : 400} />
    </Canvas>
  );
}
