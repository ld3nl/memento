"use client";

import dynamic from "next/dynamic";
import type { BurstSceneProps } from "./BurstScene.types";

const BurstScene = dynamic(
  () => import("./BurstScene").then((mod) => mod.BurstScene),
  {
    ssr: false,
    loading: () => (
      <p className="text-secondary p-8 text-center text-sm">
        Loading visualization…
      </p>
    ),
  },
);

export function BurstSceneLazy(props: BurstSceneProps) {
  return <BurstScene {...props} />;
}
