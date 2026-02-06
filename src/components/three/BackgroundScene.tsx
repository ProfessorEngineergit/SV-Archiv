"use client";

import { useRef, useMemo, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Detect user motion preferences
function useAccessibilityMotion(): boolean {
  const registerListener = (cb: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", cb);
    return () => query.removeEventListener("change", cb);
  };
  const readValue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const serverFallback = () => false;
  return useSyncExternalStore(registerListener, readValue, serverFallback);
}

// Check if device supports WebGL
function useGPUCapability(): boolean {
  const noOp = () => () => {};
  const detectGL = () => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  };
  return useSyncExternalStore(noOp, detectGL, () => true);
}

// Pseudo-random generator
function seededRandom(entropy: number) {
  let v = entropy;
  return () => {
    v = (v * 16807) % 2147483647;
    return v / 2147483647;
  };
}

// Floating particles - ascending data visualization
function FloatingParticles({ count = 1200, frozen = false }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const rng = seededRandom(3141);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 40;
      pos[i * 3 + 1] = (rng() - 0.5) * 24;
      pos[i * 3 + 2] = (rng() - 0.5) * 36 - 8;
      spd[i] = 0.012 + rng() * 0.04;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || frozen) return;
    const arr = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = -12;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={meshRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#67e8f9"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Orbiting crystal swarm
function CrystalSwarm({ count = 800, frozen = false }) {
  const swarmRef = useRef<THREE.Points>(null);

  const [crystalPos, homePos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const rng = seededRandom(2718);

    for (let i = 0; i < count; i++) {
      const az = rng() * 6.283;
      const el = Math.acos(2 * rng() - 1);
      const rad = 2 + rng() * 4;

      pos[i * 3] = rad * Math.sin(el) * Math.cos(az);
      pos[i * 3 + 1] = rad * Math.sin(el) * Math.sin(az);
      pos[i * 3 + 2] = rad * Math.cos(el) - 5;

      home[i * 3] = pos[i * 3];
      home[i * 3 + 1] = pos[i * 3 + 1];
      home[i * 3 + 2] = pos[i * 3 + 2];
    }
    return [pos, home];
  }, [count]);

  useFrame((ctx) => {
    if (!swarmRef.current || frozen) return;
    const t = ctx.clock.elapsedTime;
    const arr = swarmRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const hx = homePos[i * 3];
      const hy = homePos[i * 3 + 1];
      const hz = homePos[i * 3 + 2];

      const spin = t * 0.18;
      arr[i * 3] = hx * Math.cos(spin) - (hz + 5) * Math.sin(spin);
      arr[i * 3 + 2] = hx * Math.sin(spin) + (hz + 5) * Math.cos(spin) - 5;
      arr[i * 3 + 1] = hy + Math.sin(t * 1.2 + hx * 0.3) * 0.2;
    }
    swarmRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={swarmRef} positions={crystalPos} stride={3}>
      <PointMaterial
        transparent
        color="#c4b5fd"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Rotating geometric rings at various angles
function GeometricRing({ diameter = 5, altitude = 0, speed = 0.2, tilt = 0, color = "#67e8f9", frozen = false }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!ringRef.current || frozen) return;
    ringRef.current.rotation.z = ctx.clock.elapsedTime * speed;
    ringRef.current.rotation.x = tilt + Math.sin(ctx.clock.elapsedTime * 0.3) * 0.08;
    ringRef.current.rotation.y = ctx.clock.elapsedTime * speed * 0.3;
  });

  return (
    <mesh ref={ringRef} position={[0, altitude, -5]}>
      <torusGeometry args={[diameter, 0.025, 10, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Grid floor with depth
function GridFloor({ frozen = false }) {
  const floorRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (frozen) return;
    if (floorRef.current) {
      floorRef.current.position.y = -4 + Math.sin(ctx.clock.elapsedTime * 0.2) * 0.1;
    }
    if (beamRef.current) {
      beamRef.current.position.z = ((ctx.clock.elapsedTime * 1.8) % 46) - 23;
    }
  });

  return (
    <group ref={floorRef} position={[0, -4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80, 28, 28]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.04} />
      </mesh>
      <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[80, 0.4]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// Central 3D structure - nested rotating polyhedra
function CentralStructure({ frozen = false }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!groupRef.current || frozen) return;
    const t = ctx.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.12;

    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.35;
      innerRef.current.rotation.z = t * 0.2;
      const pulse = Math.sin(t * 1.5) * 0.08 + 1;
      innerRef.current.scale.setScalar(pulse);
    }
    if (midRef.current) {
      midRef.current.rotation.x = -t * 0.15;
      midRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <mesh>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={midRef}>
        <dodecahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#ecfeff" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Floating 3D cubes
function FloatingCube({ position, size = 0.5, offset = 0, frozen = false }: {
  position: [number, number, number];
  size?: number;
  offset?: number;
  frozen?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!ref.current || frozen) return;
    const t = ctx.clock.elapsedTime;
    ref.current.rotation.x = t * 0.35 + offset;
    ref.current.rotation.y = t * 0.2 + offset;
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + offset) * 0.25;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh scale={0.55}>
        <octahedronGeometry args={[size]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Light pillars
function LightPillars({ frozen = false }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!ref.current || frozen) return;
    ref.current.rotation.y = ctx.clock.elapsedTime * 0.025;
  });

  const pillars = useMemo(() => {
    const gen = seededRandom(1618);
    return Array.from({ length: 4 }, () => ({
      x: (gen() - 0.5) * 28,
      z: -8 - gen() * 14,
      h: 18 + gen() * 12,
      o: 0.01 + gen() * 0.018,
    }));
  }, []);

  return (
    <group ref={ref}>
      {pillars.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 6, p.z]}>
          <cylinderGeometry args={[0.03, 0.12, p.h, 4]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={p.o} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// Lost Document Projection - 404 visualization
function LostDocumentProjection({ frozen = false }) {
  const projRef = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!projRef.current || frozen) return;
    projRef.current.rotation.y = ctx.clock.elapsedTime * 0.2;
    projRef.current.position.y = Math.sin(ctx.clock.elapsedTime * 0.4) * 0.2;
  });

  return (
    <group ref={projRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[2.4, 3.2, 0.1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.2, 3]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

interface ArchiveSceneConfig {
  variant?: "default" | "404";
}

export default function BackgroundScene({ variant = "default" }: ArchiveSceneConfig) {
  const reduceMotion = useAccessibilityMotion();
  const hasWebGL = useGPUCapability();

  if (!hasWebGL) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
            backgroundSize: "52px 52px"
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.5, 13], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 16, 50]} />

        <GridFloor frozen={reduceMotion} />
        <FloatingParticles count={variant === "404" ? 600 : 1200} frozen={reduceMotion} />
        <CrystalSwarm count={variant === "404" ? 400 : 800} frozen={reduceMotion} />

        <GeometricRing diameter={4} altitude={-0.5} speed={0.22} tilt={1.57} color="#67e8f9" frozen={reduceMotion} />
        <GeometricRing diameter={6} altitude={0.3} speed={-0.14} tilt={1.2} color="#c4b5fd" frozen={reduceMotion} />
        <GeometricRing diameter={8} altitude={1} speed={0.09} tilt={0.8} color="#67e8f9" frozen={reduceMotion} />

        {variant !== "404" && <CentralStructure frozen={reduceMotion} />}

        <FloatingCube position={[-5, 2, -9]} size={0.5} offset={0} frozen={reduceMotion} />
        <FloatingCube position={[6, -0.5, -11]} size={0.7} offset={1.1} frozen={reduceMotion} />
        <FloatingCube position={[-3, -1.5, -7]} size={0.4} offset={2.2} frozen={reduceMotion} />

        <LightPillars frozen={reduceMotion} />

        {variant === "404" && <LostDocumentProjection frozen={reduceMotion} />}
      </Canvas>
    </div>
  );
}
