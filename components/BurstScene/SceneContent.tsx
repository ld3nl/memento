import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CONFIG } from "./config";
import { BurstItem, TooltipData } from "./types";
import { vertexShader } from "./shaders/vertex";
import { fragmentShader } from "./shaders/fragment";
import { easeOutCubic } from "./utils/math";

type SceneContentProps = {
  items: BurstItem[];
  maxDelay: number;
  reduceMotion: boolean;
  setTooltip: (t: TooltipData | null) => void;
};

export const SceneContent = ({
  items,
  maxDelay,
  reduceMotion,
  setTooltip,
}: SceneContentProps) => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);
  const { clock, invalidate } = useThree();
  const [animationFinished, setAnimationFinished] = React.useState(false);

  // 1. Initialize Geometry Attributes (Run once per item set)
  React.useLayoutEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const count = items.length;

    // Attributes
    const aFilled = new Float32Array(count);
    const aCurrent = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const tempColor = new THREE.Color();

    const dummy = new THREE.Object3D();

    items.forEach((item, i) => {
      aFilled[i] = item.isFilled ? 1.0 : 0.0;
      aCurrent[i] = item.isCurrentWeek ? 1.0 : 0.0;
      tempColor.set(item.color);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;

      // Initialize matrix w/ Rotation
      if (reduceMotion) {
        dummy.position.set(item.tx, -item.ty, 0);
        dummy.rotation.set(0, 0, item.rotation);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, 0, 0); // Start at center? Or start at target pos with 0 scale?
        // Let's start at center with 0 scale to "burst" out
        // Actually, logic below animates Tx/Ty.
        // So initialize at 0,0,0 scale 0
        dummy.scale.set(0, 0, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    });

    mesh.geometry.setAttribute(
      "aFilled",
      new THREE.InstancedBufferAttribute(aFilled, 1),
    );
    mesh.geometry.setAttribute(
      "aCurrent",
      new THREE.InstancedBufferAttribute(aCurrent, 1),
    );
    mesh.geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colors, 3),
    );

    mesh.instanceMatrix.needsUpdate = true;

    // Reset animation state when items change
    setAnimationFinished(false);

    // Force initial frame
    invalidate();

    // Reset clock for new animation?
    // Usually better to track start time relative to clock
    // But since we use clock.elapsedTime in loop, we rely on "absolute" time for delta
    // We should track a local start time or use absolute time - let's stick to simple elapsed check with offset.
    // However, if items change, we want to re-trigger animation.
    // The current logic simply uses `time` vs `item.delayMs`.
    // If we re-mount, clock might not reset.
    // Proper way: Store a startTime ref.
  }, [items, reduceMotion, invalidate]);

  const startTimeRef = React.useRef(0);
  React.useEffect(() => {
    startTimeRef.current = clock.elapsedTime * 1000;
  }, [items, clock]);

  // 2. Animation Loop (CPU Side)
  // This ensures perfect sync between Visuals and Physics (Raycasting)
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    const globalTime = clock.elapsedTime * 1000;
    const time = globalTime - startTimeRef.current; // Time since mount of this set

    // Update shader time for pulsing effect
    mat.uniforms.uTime.value = globalTime;

    // Always invalidate if we have pulsing (current week) property?
    // Or only when animation running?
    // Pulse needs constant frame updates to look smooth.
    // If we want to save battery, we might disable pulse or limit fps.
    // For now, if animation finished, we can throttle or stop invalidating if the pulse isn't critical.
    // However, the critique mentioned continuous rendering.
    // Pulse is a visual effect. If we want it, we must render.
    // Let's compromise: Render pulse, but optimizing matrix updates is key.

    if (reduceMotion) {
      if (!animationFinished) setAnimationFinished(true);
      invalidate(); // For pulse
      return;
    }

    const isAnimationComplete =
      time > maxDelay + CONFIG.ANIMATION_DURATION_MS + 200;

    if (isAnimationComplete) {
      if (!animationFinished) {
        setAnimationFinished(true);
        // Final update to ensure everything is in place
        // (Handled by the logic below naturally as t=1)
      }
      // Continue rendering for Pulse effect (invalidate)
      // but SKIP matrix calculations
      invalidate();
      return;
    }

    // Direct Buffer Access for Performance (avoid 4000 setMatrixAt calls overhead)
    // Actually, simple setMatrixAt with dummy object is cleaner to read and handle rotation
    // Optimizing with direct array access for rotation + translation is math heavy here.
    // Let's use the dummy object approach but optimized?
    // No, creating objects is slow.
    // Let's use direct array access if we can, or just optimized matrix composition.
    // With Rotation, Scale, Position...
    // Matrix:
    // [ sx*cos  -sy*sin  0  tx ]
    // [ sx*sin   sy*cos  0  ty ]
    // ...
    // Since we have rotation, "Direct Buffer Access" gets complex.
    // We will stick to `dummy.updateMatrix()` + `mesh.setMatrixAt` for Safety/Correctness first,
    // unless performance is absolutely killed.
    // Actually, `setMatrixAt` updates the array locally. It's fine. The overhead is creating the object.
    // reuse `dummy` object.

    let activeUpdate = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const start = item.delayMs;

      if (time < start) {
        // Keep at zero scale
        // Only need to set if not already set (optimization?)
        // But we re-write every frame during anim.
        dummy.position.set(0, 0, 0);
        dummy.scale.set(0, 0, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const tLinear = Math.min(
        (time - start) / CONFIG.ANIMATION_DURATION_MS,
        1.0,
      );
      const t = easeOutCubic(tLinear);

      // Interpolate
      const currentScale =
        CONFIG.MIN_SCALE + (CONFIG.MAX_SCALE - CONFIG.MIN_SCALE) * t;
      const currentTx = item.tx * t;
      const currentTy = -item.ty * t;

      dummy.position.set(currentTx, currentTy, 0);
      dummy.rotation.set(0, 0, item.rotation);
      dummy.scale.set(currentScale, currentScale, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (tLinear < 1.0) activeUpdate = true;
    }

    if (activeUpdate || !isAnimationComplete) {
      mesh.instanceMatrix.needsUpdate = true;
      invalidate(); // Request simple frame
    }
  });

  // 3. Interactions
  const onMove = React.useCallback(
    (e: any) => {
      // Throttle?
      const instanceId = e.instanceId;
      if (instanceId !== undefined && items[instanceId]) {
        const item = items[instanceId];
        setTooltip({
          x: e.clientX,
          y: e.clientY,
          text: `Year ${item.yearIndex + 1}, Week ${item.weekIndex}${
            item.isCurrentWeek ? " (Current)" : ""
          }`,
        });
      }
    },
    [items, setTooltip],
  );

  const onLeave = React.useCallback(() => setTooltip(null), [setTooltip]);

  const shaderMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uBorderThickness: { value: CONFIG.BORDER_THICKNESS },
        },
        transparent: true,
      }),
    [],
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, items.length]} // Geometry will be set below
      onPointerMove={onMove}
      onPointerOut={onLeave}
    >
      <planeGeometry args={[CONFIG.BOX_SIZE, CONFIG.BOX_SIZE]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </instancedMesh>
  );
};
