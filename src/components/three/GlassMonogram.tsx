"use client";

/**
 * Hero centrepiece: the J/ monogram extruded into bevelled glass, floating in front of
 * the giant wordmark. Lit only by procedural Lightformers (no HDR download), with a
 * single Ice rim light, so the glass reads as dark interior with bright edges.
 *
 * High tier: MeshTransmissionMaterial (real refraction + chromatic aberration).
 * Low tier: a dark polished physical material (no extra render pass).
 * Paused off-screen / hidden tab; geometry and materials disposed by R3F on unmount.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MONO } from "./monogram";

type Props = {
  quality: "low" | "high";
  theme: "dark" | "light";
  scrollProgress: () => number;
  reduceMotion: boolean;
  onReady?: () => void;
};

function useMonogramGeometry() {
  return useMemo(() => {
    const { cx, cy, R, r, top, lip, slash } = MONO;
    const j = new THREE.Shape();
    j.moveTo(cx + r, top);
    j.lineTo(cx + R, top);
    j.lineTo(cx + R, cy);
    j.absarc(cx, cy, R, 0, -Math.PI, true);
    j.lineTo(cx - R, lip);
    j.lineTo(cx - r, lip);
    j.lineTo(cx - r, cy);
    j.absarc(cx, cy, r, Math.PI, Math.PI * 2, false);
    j.lineTo(cx + r, top);

    const s = new THREE.Shape();
    s.moveTo(slash[0][0], slash[0][1]);
    slash.slice(1).forEach(([x, y]) => s.lineTo(x, y));
    s.closePath();

    const geo = new THREE.ExtrudeGeometry([j, s], {
      depth: 0.5,
      curveSegments: 48,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: 6,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Monogram({ quality, theme, scrollProgress, reduceMotion }: Omit<Props, "onReady">) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMonogramGeometry();
  const intro = useRef(reduceMotion ? 1 : 0);
  // What the glass refracts: a soft light-to-dark gradient (never shown directly). This is what
  // makes the faces read as lit glass rather than black plastic.
  const bg = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    // Dark field crossed by one diagonal light band: faces pick up a single bright sweep.
    const grad = g.createLinearGradient(0, 0, 512, 512);
    if (theme === "light") {
      grad.addColorStop(0, "#c9d0dc");
      grad.addColorStop(0.45, "#f2f5fa");
      grad.addColorStop(0.55, "#ffffff");
      grad.addColorStop(1, "#a7b0bf");
    } else {
      grad.addColorStop(0, "#101318");
      grad.addColorStop(0.3, "#2a3039");
      grad.addColorStop(0.48, "#e9eef6");
      grad.addColorStop(0.66, "#3a414c");
      grad.addColorStop(1, "#101318");
    }
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [theme]);
  useEffect(() => () => bg.dispose(), [bg]);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    // Entrance: swings in from the left and settles (once).
    intro.current = Math.min(1, intro.current + dt / 1.8);
    const e = 1 - Math.pow(1 - intro.current, 4);
    const p = scrollProgress();
    const t = reduceMotion ? 0 : state.clock.elapsedTime;
    const px = reduceMotion ? 0 : state.pointer.x;
    const py = reduceMotion ? 0 : state.pointer.y;

    // Rests at a three-quarter angle so the bevels catch the side lights.
    const targetY = 0.55 + (1 - e) * -1.6 + Math.sin(t * 0.35) * 0.22 + px * 0.3 + p * 1.4;
    const targetX = 0.28 - py * 0.2 + p * 0.5;
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, targetY, 4, dt);
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, targetX, 4, dt);
    m.rotation.z = -0.12;
    m.position.y = Math.sin(t * 0.8) * 0.05 + p * 1.2;
    m.scale.setScalar((0.86 + 0.14 * e) * (1 - p * 0.25));
  });

  return (
    <mesh ref={ref} geometry={geo}>
      {quality === "high" ? (
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.3}
          samples={6}
          resolution={512}
          thickness={1.2}
          roughness={0.14}
          ior={1.45}
          chromaticAberration={0.12}
          anisotropy={0.2}
          distortion={0.08}
          distortionScale={0.25}
          temporalDistortion={0}
          color="#f4f7fc"
          attenuationColor={theme === "light" ? "#ffffff" : "#4f5663"}
          attenuationDistance={theme === "light" ? 6 : 2.6}
          envMapIntensity={2}
          background={bg}
        />
      ) : (
        <meshPhysicalMaterial color={theme === "light" ? "#c9d0dc" : "#2a313d"} metalness={0.9} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.6} />
      )}
    </mesh>
  );
}

/** Studio lighting built from emissive cards: bright top softbox, side strips, one Ice rim. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={6} color="#ffffff" position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 0.5, 1]} />
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[5, -0.5, 2]} rotation-y={-Math.PI / 2} scale={[10, 0.35, 1]} />
      <Lightformer form="rect" intensity={8} color="#a8c8ff" position={[3.5, 0.5, -4]} rotation-y={-Math.PI / 4} scale={[3, 6, 1]} />
      {/* Soft frontal key from upper left: gives the front faces their white-to-dark gradient */}
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[-3, 3, 5]} target={[0, 0, 0]} scale={[7, 5, 1]} />
      <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[2, -2, 5]} target={[0, 0, 0]} scale={3} />
    </Environment>
  );
}

export default function GlassMonogram({ quality, theme, scrollProgress, reduceMotion, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7], fov: 30 }}
        aria-hidden
        onCreated={() => requestAnimationFrame(() => onReady?.())}
      >
        <Studio />
        <Monogram quality={quality} theme={theme} scrollProgress={scrollProgress} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
