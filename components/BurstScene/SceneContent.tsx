import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import type { BurstItem, ItemShape, TooltipData } from "./BurstScene.types";
import { CONFIG } from "./config";
import { fragmentShader } from "./shaders/fragment";
import { vertexShader } from "./shaders/vertex";
import { easeOutCubic } from "./utils/math";

type SceneContentProps = {
  items: BurstItem[];
  maxDelay: number;
  reduceMotion: boolean;
  setTooltip: (t: TooltipData | null) => void;
  shape: ItemShape;
  boxSize: number;
};

const HOVER_SCALE = 2.0;
const HOVER_LERP_SPEED = 0.15;

// Extracted component for instanced mesh rendering
const InstancedBurstMesh = React.forwardRef<
  THREE.InstancedMesh,
  {
    items: BurstItem[];
    boxSize: number;
    shaderMaterial: THREE.ShaderMaterial;
    onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut: () => void;
  }
>(({ items, boxSize, shaderMaterial, onPointerMove, onPointerOut }, ref) => {
  const InstancedMesh = "instancedMesh";
  const PlaneGeometry = "planeGeometry";
  const Primitive = "primitive";

  return (
    <InstancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    >
      <PlaneGeometry args={[boxSize, boxSize]} />
      <Primitive object={shaderMaterial} attach="material" />
    </InstancedMesh>
  );
});

InstancedBurstMesh.displayName = "InstancedBurstMesh";

// Hook for managing animation state and timing
const useAnimationState = (items: BurstItem[], clock: THREE.Clock) => {
  const startTimeRef = React.useRef(0);
  const animationFinishedRef = React.useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: items is used as a trigger to reset animation
  React.useEffect(() => {
    startTimeRef.current = clock.elapsedTime * 1000;
    animationFinishedRef.current = false;
  }, [items, clock]);

  return { startTimeRef, animationFinishedRef };
};

// Initialize geometry attributes
const useGeometrySetup = (
  meshRef: React.RefObject<THREE.InstancedMesh>,
  items: BurstItem[],
  reduceMotion: boolean,
  invalidate: () => void,
) => {
  React.useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const count = items.length;
    const aFilled = new Float32Array(count);
    const aCurrent = new Float32Array(count);
    const aIndex = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const tempColor = new THREE.Color();
    const dummy = new THREE.Object3D();

    items.forEach((item, i) => {
      aFilled[i] = item.isFilled ? 1.0 : 0.0;
      aCurrent[i] = item.isCurrentWeek ? 1.0 : 0.0;
      aIndex[i] = i;
      tempColor.set(item.color);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;

      if (reduceMotion) {
        dummy.position.set(item.tx, -item.ty, 0);
        dummy.rotation.set(0, 0, item.rotation);
        dummy.scale.set(1, 1, 1);
      } else {
        dummy.position.set(0, 0, 0);
        dummy.scale.set(0, 0, 1);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
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
      "aIndex",
      new THREE.InstancedBufferAttribute(aIndex, 1),
    );
    mesh.geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colors, 3),
    );
    mesh.instanceMatrix.needsUpdate = true;

    invalidate();
  }, [items, reduceMotion, invalidate, meshRef]);
};

export const SceneContent = ({
  items,
  maxDelay,
  reduceMotion,
  setTooltip,
  shape,
  boxSize,
}: SceneContentProps) => {
  const { clock, invalidate, camera } = useThree();
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const hoveredIndexRef = React.useRef<number | null>(null);
  const itemScalesRef = React.useRef<Float32Array>(
    new Float32Array(items.length).fill(1),
  );
  const mouseWorldRef = React.useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999),
  );
  const raycasterRef = React.useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseNDCRef = React.useRef<THREE.Vector2>(new THREE.Vector2());
  const dummyRef = React.useRef<THREE.Object3D>(new THREE.Object3D());

  const { startTimeRef, animationFinishedRef } = useAnimationState(
    items,
    clock,
  );

  // Create shader material with useMemo to handle shape changes
  const shaderMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uBorderThickness: { value: CONFIG.BORDER_THICKNESS },
          uIsCircle: { value: shape === "circle" ? 1.0 : 0.0 },
          uColorWaveSpeed: { value: CONFIG.COLOR_WAVE_SPEED },
          uColorWaveOffset: { value: CONFIG.COLOR_WAVE_OFFSET },
        },
        transparent: true,
      }),
    [shape],
  );

  // Reset scales when items length changes
  React.useEffect(() => {
    itemScalesRef.current = new Float32Array(items.length).fill(1);
  }, [items.length]);

  useGeometrySetup(meshRef, items, reduceMotion, invalidate);

  useFrame(({ pointer }) => {
    const mesh = meshRef.current;
    const mat = shaderMaterial;
    const mouseWorld = mouseWorldRef.current;
    const raycaster = raycasterRef.current;
    const mouseNDC = mouseNDCRef.current;
    const dummy = dummyRef.current;

    if (!mesh || !mouseWorld || !raycaster || !mouseNDC || !dummy) {
      return;
    }

    // Update mouse world position for magnetic effect
    mouseNDC.set(pointer.x, pointer.y);
    raycaster.setFromCamera(mouseNDC, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    if (intersection) {
      mouseWorld.set(intersection.x, intersection.y);
    }

    const globalTime = clock.elapsedTime * 1000;
    const time = globalTime - startTimeRef.current;

    // Update shader uniforms
    mat.uniforms.uTime.value = globalTime;
    mat.uniforms.uColorWaveSpeed.value = CONFIG.COLOR_WAVE_SPEED;
    mat.uniforms.uColorWaveOffset.value = CONFIG.COLOR_WAVE_OFFSET;

    if (reduceMotion) {
      animationFinishedRef.current = true;
    }

    const isAnimationComplete =
      time > maxDelay + CONFIG.ANIMATION_DURATION_MS + 200;
    const mouseX = mouseWorld.x;
    const mouseY = mouseWorld.y;
    const magneticForce = CONFIG.MAGNETIC_FORCE;
    const magneticRadius = CONFIG.MAGNETIC_RADIUS;
    const magneticFalloff = CONFIG.MAGNETIC_FALLOFF;
    const hoveredIdx = hoveredIndexRef.current;
    let activeUpdate = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const start = item.delayMs;

      // Calculate hover scale
      const targetHoverScale = i === hoveredIdx ? HOVER_SCALE : 1.0;
      const currentHoverScale = itemScalesRef.current[i] ?? 1;
      const newHoverScale =
        currentHoverScale +
        (targetHoverScale - currentHoverScale) * HOVER_LERP_SPEED;
      itemScalesRef.current[i] = newHoverScale;

      if (Math.abs(newHoverScale - targetHoverScale) > 0.01) {
        activeUpdate = true;
      }

      // Base target position
      let targetX = item.tx;
      let targetY = -item.ty;

      // Apply magnetic effect
      if (item.isFilled && (isAnimationComplete || time >= start)) {
        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magneticRadius && dist > 0) {
          const normalizedDist = dist / magneticRadius;
          const force = (1 - normalizedDist) ** magneticFalloff * magneticForce;
          targetX += (dx / dist) * force;
          targetY += (dy / dist) * force;
          activeUpdate = true;
        }
      }

      if (reduceMotion || isAnimationComplete) {
        dummy.position.set(targetX, targetY, 0);
        dummy.rotation.set(0, 0, item.rotation);
        dummy.scale.set(newHoverScale, newHoverScale, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      if (time < start) {
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
      const baseScale =
        CONFIG.MIN_SCALE + (CONFIG.MAX_SCALE - CONFIG.MIN_SCALE) * t;
      const currentScale = baseScale * newHoverScale;
      const currentTx = targetX * t;
      const currentTy = targetY * t;

      dummy.position.set(currentTx, currentTy, 0);
      dummy.rotation.set(0, 0, item.rotation);
      dummy.scale.set(currentScale, currentScale, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (tLinear < 1.0) activeUpdate = true;
    }

    if (activeUpdate || !isAnimationComplete || !reduceMotion) {
      mesh.instanceMatrix.needsUpdate = true;
      invalidate();
    }
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const instanceId = e.instanceId;
    if (instanceId !== undefined && items[instanceId]) {
      const item = items[instanceId];
      hoveredIndexRef.current = instanceId;
      const status = item.isCurrentWeek
        ? " (Current)"
        : item.isFilled
          ? " (Lived)"
          : "";
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        text: `Age ${item.yearIndex}, Week ${item.weekIndex} - ${item.dateRangeLabel}${status}`,
      });
      invalidate();
    }
  };

  const onLeave = () => {
    hoveredIndexRef.current = null;
    setTooltip(null);
    invalidate();
  };

  return (
    <InstancedBurstMesh
      ref={meshRef}
      items={items}
      boxSize={boxSize}
      shaderMaterial={shaderMaterial}
      onPointerMove={onMove}
      onPointerOut={onLeave}
    />
  );
};
