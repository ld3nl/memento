import type * as THREE from "three";
import type { LifeTableProps } from "../LifeTable";

export type ItemShape = "square" | "circle";

export type BurstSceneProps = LifeTableProps & {
  totalWeeks?: number;
  /** Shape of each item: 'square' or 'circle'. Defaults to 'square' */
  shape?: ItemShape;
  /** Base item size in rem at 1440px viewport. Defaults to 0.5 */
  itemSizeRem?: number;
  /** Base spacing between items in rem at 1440px viewport. Defaults to 0.5 */
  itemSpacingRem?: number;
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
