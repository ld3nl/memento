"use client";

import * as stylex from "@stylexjs/stylex";
import dynamic from "next/dynamic";
import { tokens } from "../../styles/tokens.stylex";
import type { BurstSceneProps } from "./BurstScene.types";

const styles = stylex.create({
  loading: {
    marginTop: 0,
    marginBottom: 0,
    paddingBlock: "2rem",
    paddingInline: "2rem",
    textAlign: "center",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
});

const BurstScene = dynamic(
  () => import("./BurstScene").then(mod => mod.BurstScene),
  {
    ssr: false,
    loading: () => (
      <p {...stylex.props(styles.loading)}>Loading visualization…</p>
    ),
  }
);

export function BurstSceneLazy(props: BurstSceneProps) {
  return <BurstScene {...props} />;
}
