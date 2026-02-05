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

// Year 4000 Archive pseudo-random generator
function archiveNumberStream(entropy: number) {
  let v = entropy;
  return () => {
    v = (v * 16807) % 2147483647;
    return v / 2147483647;
  };
}

// Quantum Data Transfer Visualization - ascending information packets
function QuantumDataTransfer({ particleCount = 1600, frozen = false }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const [locationData, riseRates] = useMemo(() => {
    const locs = new Float32Array(particleCount * 3);
    const rates = new Float32Array(particleCount);
    const numGen = archiveNumberStream(3141);
    
    for (let p = 0; p < particleCount; p++) {
      const baseX = (numGen() - 0.5) * 42;
      const baseZ = (numGen() - 0.5) * 38 - 8;
      locs[p * 3] = baseX + (numGen() - 0.5) * 1.8;
      locs[p * 3 + 1] = (numGen() - 0.5) * 26;
      locs[p * 3 + 2] = baseZ + (numGen() - 0.5) * 1.8;
      rates[p] = 0.018 + numGen() * 0.055;
    }
    return [locs, rates];
  }, [particleCount]);

  useFrame(() => {
    if (!meshRef.current || frozen) return;
    const arr = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let p = 0; p < particleCount; p++) {
      arr[p * 3 + 1] += riseRates[p];
      if (arr[p * 3 + 1] > 13) arr[p * 3 + 1] = -13;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={meshRef} positions={locationData} stride={3}>
      <PointMaterial
        transparent
        color="#67e8f9"
        size={0.016}
        sizeAttenuation
        depthWrite={false}
        opacity={0.52}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Memory Crystal Swarm - orbiting knowledge fragments
function MemoryCrystalSwarm({ crystalCount = 1100, frozen = false }) {
  const swarmRef = useRef<THREE.Points>(null);
  
  const [crystalPos, homePos] = useMemo(() => {
    const pos = new Float32Array(crystalCount * 3);
    const home = new Float32Array(crystalCount * 3);
    const rng = archiveNumberStream(2718);
    
    for (let c = 0; c < crystalCount; c++) {
      const az = rng() * 6.283;
      const el = Math.acos(2 * rng() - 1);
      const rad = 2.5 + rng() * 3.8;
      
      pos[c * 3] = rad * Math.sin(el) * Math.cos(az);
      pos[c * 3 + 1] = rad * Math.sin(el) * Math.sin(az);
      pos[c * 3 + 2] = rad * Math.cos(el) - 5;
      
      home[c * 3] = pos[c * 3];
      home[c * 3 + 1] = pos[c * 3 + 1];
      home[c * 3 + 2] = pos[c * 3 + 2];
    }
    return [pos, home];
  }, [crystalCount]);

  useFrame((ctx) => {
    if (!swarmRef.current || frozen) return;
    const t = ctx.clock.elapsedTime;
    const arr = swarmRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let c = 0; c < crystalCount; c++) {
      const hx = homePos[c * 3];
      const hy = homePos[c * 3 + 1];
      const hz = homePos[c * 3 + 2];
      
      const spin = t * 0.22;
      arr[c * 3] = hx * Math.cos(spin) - (hz + 5) * Math.sin(spin);
      arr[c * 3 + 2] = hx * Math.sin(spin) + (hz + 5) * Math.cos(spin) - 5;
      arr[c * 3 + 1] = hy + Math.sin(t * 1.6 + hx * 0.35) * 0.22;
    }
    swarmRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={swarmRef} positions={crystalPos} stride={3}>
      <PointMaterial
        transparent
        color="#c4b5fd"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.72}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Chronometric Ring - time indicator
function ChronometricRing({ diameter = 5, altitude = 0, angularVelocity = 0.2, hue = "#67e8f9", frozen = false }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!ringRef.current || frozen) return;
    ringRef.current.rotation.z = ctx.clock.elapsedTime * angularVelocity;
    ringRef.current.rotation.x = 1.571 + Math.sin(ctx.clock.elapsedTime * 0.4) * 0.07;
  });

  return (
    <mesh ref={ringRef} position={[0, altitude, -5]}>
      <torusGeometry args={[diameter, 0.022, 10, 72]} />
      <meshBasicMaterial color={hue} transparent opacity={0.48} />
    </mesh>
  );
}

// Infinite Archive Floor - holographic grid system
function InfiniteArchiveFloor({ frozen = false }) {
  const floorGroupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (frozen) return;
    if (floorGroupRef.current) {
      floorGroupRef.current.position.y = -4.2 + Math.sin(ctx.clock.elapsedTime * 0.25) * 0.12;
    }
    if (beamRef.current) {
      beamRef.current.position.z = ((ctx.clock.elapsedTime * 2.2) % 46) - 23;
    }
  });

  return (
    <group ref={floorGroupRef} position={[0, -4.2, 0]}>
      <mesh rotation={[-1.571, 0, 0]}>
        <planeGeometry args={[85, 85, 32, 32]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.055} />
      </mesh>
      <mesh rotation={[-1.571, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[85, 85, 64, 64]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.022} />
      </mesh>
      <mesh ref={beamRef} rotation={[-1.571, 0, 0]} position={[0, 0.022, 0]}>
        <planeGeometry args={[85, 0.55]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// Archive Storage Unit - floating data container
function ArchiveStorageUnit({ location, scale = 0.5, timeOffset = 0, frozen = false }: {
  location: [number, number, number];
  scale?: number;
  timeOffset?: number;
  frozen?: boolean;
}) {
  const unitRef = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!unitRef.current || frozen) return;
    unitRef.current.rotation.x = ctx.clock.elapsedTime * 0.4 + timeOffset;
    unitRef.current.rotation.y = ctx.clock.elapsedTime * 0.25 + timeOffset;
    unitRef.current.position.y = location[1] + Math.sin(ctx.clock.elapsedTime + timeOffset) * 0.22;
  });

  return (
    <group ref={unitRef} position={location}>
      <mesh>
        <boxGeometry args={[scale, scale, scale]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh scale={0.62}>
        <boxGeometry args={[scale, scale, scale]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.16} />
      </mesh>
      <mesh scale={0.26}>
        <octahedronGeometry args={[scale]} />
        <meshBasicMaterial color="#ecfeff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Guardian Drones - circling security orbs
function GuardianDrones({ frozen = false }) {
  const droneGroupRef = useRef<THREE.Group>(null);
  
  const droneConfigs = useMemo(() => [
    { radius: 5.2, speed: 0.26, yPos: -0.3, color: "#67e8f9" },
    { radius: 7.2, speed: -0.16, yPos: 0.4, color: "#c4b5fd" },
    { radius: 9.2, speed: 0.1, yPos: 1.0, color: "#fdba74" },
  ], []);

  useFrame((ctx) => {
    if (!droneGroupRef.current || frozen) return;
    droneGroupRef.current.rotation.y = ctx.clock.elapsedTime * 0.07;
  });

  return (
    <group ref={droneGroupRef} position={[0, 0, -5]}>
      {droneConfigs.map((cfg, i) => (
        <SingleDrone key={i} config={cfg} idx={i} frozen={frozen} />
      ))}
    </group>
  );
}

function SingleDrone({ config, idx, frozen }: { config: { radius: number; speed: number; yPos: number; color: string }; idx: number; frozen: boolean }) {
  const droneRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!droneRef.current || frozen) return;
    const angle = ctx.clock.elapsedTime * config.speed + idx * 2.094;
    droneRef.current.position.x = Math.cos(angle) * config.radius;
    droneRef.current.position.z = Math.sin(angle) * config.radius;
    droneRef.current.position.y = config.yPos + Math.sin(ctx.clock.elapsedTime * 1.6 + idx) * 0.35;
  });

  return (
    <mesh ref={droneRef}>
      <sphereGeometry args={[0.075, 10, 10]} />
      <meshBasicMaterial color={config.color} transparent opacity={0.82} />
    </mesh>
  );
}

// Information Terminal - floating display screen
function InformationTerminal({ pos, w = 2, h = 1.1, frozen = false }: {
  pos: [number, number, number];
  w?: number;
  h?: number;
  frozen?: boolean;
}) {
  const termRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!termRef.current || frozen) return;
    termRef.current.position.y = pos[1] + Math.sin(ctx.clock.elapsedTime * 0.65) * 0.07;
    termRef.current.lookAt(0, pos[1], 12);
    
    if (screenRef.current) {
      const flick = Math.sin(ctx.clock.elapsedTime * 16) * 0.07 + 0.93;
      (screenRef.current.material as THREE.MeshBasicMaterial).opacity = 0.11 * flick;
    }
  });

  return (
    <group ref={termRef} position={pos}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.26} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, -0.012]}>
        <planeGeometry args={[w - 0.12, h - 0.12]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.11} side={THREE.DoubleSide} />
      </mesh>
      {[-0.22, 0, 0.22].map((yOff, i) => (
        <mesh key={i} position={[0, yOff, 0.012]}>
          <planeGeometry args={[w * 0.62 - i * 0.22, 0.042]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.32 - i * 0.07} />
        </mesh>
      ))}
    </group>
  );
}

// Central Archive Nexus - main holographic structure
function CentralArchiveNexus({ frozen = false }) {
  const nexusRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);

  useFrame((ctx) => {
    if (!nexusRef.current || frozen) return;
    nexusRef.current.rotation.y = ctx.clock.elapsedTime * 0.16;
    
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = ctx.clock.elapsedTime * 0.38;
      innerCoreRef.current.rotation.z = ctx.clock.elapsedTime * 0.24;
      const pulse = Math.sin(ctx.clock.elapsedTime * 1.65) * 0.07 + 1;
      innerCoreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={nexusRef} position={[0, 0, -5]}>
      <mesh>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh>
        <dodecahedronGeometry args={[1.9, 0]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial color="#ecfeff" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

// Lost Document Projection - 404 visualization
function LostDocumentProjection({ frozen = false }) {
  const projRef = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!projRef.current || frozen) return;
    projRef.current.rotation.y = ctx.clock.elapsedTime * 0.22;
    projRef.current.position.y = Math.sin(ctx.clock.elapsedTime * 0.42) * 0.22;
  });

  return (
    <group ref={projRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[2.6, 3.6, 0.1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.07} />
      </mesh>
      {[-1.05, -0.52, 0, 0.52, 1.05].map((y, i) => (
        <mesh key={i} position={[0, y, 0.072]}>
          <planeGeometry args={[1.9 - Math.abs(y) * 0.22, 0.11]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.26 + i * 0.035} />
        </mesh>
      ))}
      <mesh position={[0, -1.25, 0.082]}>
        <ringGeometry args={[0.32, 0.42, 6]} />
        <meshBasicMaterial color="#fdba74" transparent opacity={0.52} />
      </mesh>
    </group>
  );
}

// Ascending Light Pillars
function AscendingLightPillars({ frozen = false }) {
  const pillarsRef = useRef<THREE.Group>(null);

  useFrame((ctx) => {
    if (!pillarsRef.current || frozen) return;
    pillarsRef.current.rotation.y = ctx.clock.elapsedTime * 0.035;
  });

  const pillarData = useMemo(() => {
    const gen = archiveNumberStream(1618);
    return Array.from({ length: 5 }, () => ({
      x: (gen() - 0.5) * 32,
      z: -10 - gen() * 16,
      h: 22 + gen() * 16,
      o: 0.012 + gen() * 0.022,
    }));
  }, []);

  return (
    <group ref={pillarsRef}>
      {pillarData.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 7, p.z]}>
          <cylinderGeometry args={[0.035, 0.16, p.h, 5]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={p.o} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
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
        camera={{ position: [0, 1.8, 12.5], fov: 57 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 14, 52]} />
        
        <InfiniteArchiveFloor frozen={reduceMotion} />
        <QuantumDataTransfer particleCount={variant === "404" ? 850 : 1600} frozen={reduceMotion} />
        <MemoryCrystalSwarm crystalCount={variant === "404" ? 650 : 1100} frozen={reduceMotion} />
        
        <ChronometricRing diameter={4.2} altitude={-0.6} angularVelocity={0.26} hue="#67e8f9" frozen={reduceMotion} />
        <ChronometricRing diameter={6.2} altitude={0.3} angularVelocity={-0.16} hue="#c4b5fd" frozen={reduceMotion} />
        <ChronometricRing diameter={8.2} altitude={1.1} angularVelocity={0.11} hue="#67e8f9" frozen={reduceMotion} />
        
        {variant !== "404" && <CentralArchiveNexus frozen={reduceMotion} />}
        
        <GuardianDrones frozen={reduceMotion} />
        
        <ArchiveStorageUnit location={[-5.2, 2.1, -8.5]} scale={0.52} timeOffset={0} frozen={reduceMotion} />
        <ArchiveStorageUnit location={[6.2, -0.6, -10.5]} scale={0.72} timeOffset={1.1} frozen={reduceMotion} />
        <ArchiveStorageUnit location={[-3.2, -1.6, -6.5]} scale={0.45} timeOffset={2.2} frozen={reduceMotion} />
        <ArchiveStorageUnit location={[4.2, 2.6, -12.5]} scale={0.62} timeOffset={3.3} frozen={reduceMotion} />
        
        <InformationTerminal pos={[-7.2, 1.1, -15.5]} w={2.6} h={1.5} frozen={reduceMotion} />
        <InformationTerminal pos={[8.2, 2.1, -18.5]} w={3} h={2} frozen={reduceMotion} />
        <InformationTerminal pos={[-4.2, -0.6, -20.5]} w={2} h={1.3} frozen={reduceMotion} />
        
        <AscendingLightPillars frozen={reduceMotion} />
        
        {variant === "404" && <LostDocumentProjection frozen={reduceMotion} />}
      </Canvas>
    </div>
  );
}
