import * as THREE from "three";
import { LifeTableProps } from "../../lib/types";

export type BurstSceneProps = LifeTableProps & {
  totalWeeks?: number;
};

export type BurstItem = {
  id: string;
  tx: number;
  ty: number; // Visual Y
  rotation: number; // Z-rotation in radians
  delayMs: number;
  isFilled: boolean;
  isCurrentWeek: boolean;
  yearIndex: number;
  weekIndex: number;
  color: THREE.Color;
};

export type TooltipData = {
  x: number;
  y: number;
  text: string;
};
