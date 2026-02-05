"use client";

import { useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Generate particle positions deterministically using a seed-based approach
function generateParticlePositions(count: number, seed: number): Float32Array {
  const pos = new Float32Array(count * 3);
  let current = seed;
  
  // Simple seeded pseudo-random number generator
  const seededRandom = () => {
    current = (current * 1103515245 + 12345) & 0x7fffffff;
    return (current / 0x7fffffff) - 0.5;
  };
  
  for (let i = 0; i < count; i++) {
    pos[i * 3] = seededRandom() * 20;
    pos[i * 3 + 1] = seededRandom() * 20;
    pos[i * 3 + 2] = seededRandom() * 20;
  }
  return pos;
}

// Custom hook for reduced motion preference
function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };
  
  const getSnapshot = () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };
  
  const getServerSnapshot = () => false;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Custom hook for WebGL support detection
function useWebGLSupport(): boolean {
  const subscribe = () => {
    // WebGL support doesn't change, so no subscription needed
    return () => {};
  };
  
  const getSnapshot = () => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  };
  
  const getServerSnapshot = () => true;
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Floating particles component
function Particles({ count = 500, reducedMotion = false }) {
  const ref = useRef<THREE.Points>(null);
  const positions = generateParticlePositions(count, 42);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

// Grid plane for depth
function GridPlane({ reducedMotion = false }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2 - 3;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

// Floating document wireframe for 404 page
function DocumentWireframe({ reducedMotion = false }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  const lineOffsets = [-0.6, -0.2, 0.2, 0.6];

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[2, 2.8, 0.1]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
      </mesh>
      {lineOffsets.map((yOffset, idx) => (
        <mesh key={idx} position={[0, yOffset, 0.06]}>
          <boxGeometry args={[1.4, 0.08, 0.01]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

interface BackgroundSceneProps {
  variant?: "default" | "404";
}

export default function BackgroundScene({ variant = "default" }: BackgroundSceneProps) {
  const reducedMotion = useReducedMotion();
  const webGLSupported = useWebGLSupport();

  // Fallback for no WebGL
  if (!webGLSupported) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 10, 30]} />
        
        <Particles count={variant === "404" ? 300 : 500} reducedMotion={reducedMotion} />
        <GridPlane reducedMotion={reducedMotion} />
        
        {variant === "404" && <DocumentWireframe reducedMotion={reducedMotion} />}
      </Canvas>
    </div>
  );
}
