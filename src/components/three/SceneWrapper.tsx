"use client";

import dynamic from "next/dynamic";

const BackgroundScene = dynamic(
  () => import("@/components/three/BackgroundScene"),
  { ssr: false }
);

interface SceneWrapperProps {
  variant?: "default" | "404";
}

export default function SceneWrapper({ variant = "default" }: SceneWrapperProps) {
  return <BackgroundScene variant={variant} />;
}
