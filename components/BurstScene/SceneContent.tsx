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

export const SceneContent = ({
  items,
  maxDelay,
  reduceMotion,
  setTooltip,
  shape,
  boxSize,
}: SceneContentProps) => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);
  const { clock, invalidate, camera } = useThree();
  const [animationFinished, setAnimationFinished] = React.useState(false);

  // Track hovered item for zoom effect
  const hoveredIndexRef = React.useRef<number | null>(null);
  // Track current scale for each item (for smooth lerping)
  const itemScalesRef = React.useRef<Float32Array>(
    new Float32Array(items.length).fill(1),
  );

  // Track mouse position in world coordinates
  const mouseWorldRef = React.useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999),
  );
  const raycaster = React.useMemo(() => new THREE.Raycaster(), []);
  const mouseNDC = React.useMemo(() => new THREE.Vector2(), []);

  // 1. Initialize Geometry Attributes (Run once per item set)
  React.useLayoutEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const count = items.length;

    // Reset hover scales array
    itemScalesRef.current = new Float32Array(count).fill(1);

    // Attributes
    const aFilled = new Float32Array(count);
    const aCurrent = new Float32Array(count);
    const aIndex = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const tempColor = new THREE.Color();

    const dummy = new THREE.Object3D();

    items.forEach((item, i) => {
      aFilled[i] = item.isFilled ? 1.0 : 0.0;
      aCurrent[i] = item.isCurrentWeek ? 1.0 : 0.0;
      aIndex[i] = i; // Store index for color wave
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
        dummy.position.set(0, 0, 0);
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
      "aIndex",
      new THREE.InstancedBufferAttribute(aIndex, 1),
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
  }, [items, reduceMotion, invalidate]);

  const startTimeRef = React.useRef(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: items is used as a trigger to reset animation
  React.useEffect(() => {
    startTimeRef.current = clock.elapsedTime * 1000;
  }, [items, clock]);

  // 2. Animation Loop (CPU Side)
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  useFrame(({ pointer }) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    // Update mouse world position for magnetic effect
    mouseNDC.set(pointer.x, pointer.y);
    raycaster.setFromCamera(mouseNDC, camera);
    // Get intersection with z=0 plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    if (intersection) {
      mouseWorldRef.current.set(intersection.x, intersection.y);
    }

    const globalTime = clock.elapsedTime * 1000;
    const time = globalTime - startTimeRef.current;

    // Update shader time and color wave uniforms
    mat.uniforms.uTime.value = globalTime;
    mat.uniforms.uColorWaveSpeed.value = CONFIG.COLOR_WAVE_SPEED;
    mat.uniforms.uColorWaveOffset.value = CONFIG.COLOR_WAVE_OFFSET;

    if (reduceMotion) {
      if (!animationFinished) setAnimationFinished(true);
      // Still need to update for hover effect
    }

    const isAnimationComplete =
      time > maxDelay + CONFIG.ANIMATION_DURATION_MS + 200;

    // Magnetic effect parameters
    const mouseX = mouseWorldRef.current.x;
    const mouseY = mouseWorldRef.current.y;
    const magneticForce = CONFIG.MAGNETIC_FORCE;
    const magneticRadius = CONFIG.MAGNETIC_RADIUS;
    const magneticFalloff = CONFIG.MAGNETIC_FALLOFF;

    const hoveredIdx = hoveredIndexRef.current;
    let activeUpdate = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const start = item.delayMs;

      // Calculate target hover scale
      const targetHoverScale = i === hoveredIdx ? HOVER_SCALE : 1.0;
      // Lerp current scale towards target
      const currentHoverScale = itemScalesRef.current[i];
      const newHoverScale =
        currentHoverScale +
        (targetHoverScale - currentHoverScale) * HOVER_LERP_SPEED;
      itemScalesRef.current[i] = newHoverScale;

      // Check if still animating hover
      if (Math.abs(newHoverScale - targetHoverScale) > 0.01) {
        activeUpdate = true;
      }

      // Base target position
      let targetX = item.tx;
      let targetY = -item.ty;

      // Apply magnetic effect only to filled items
      if (item.isFilled && (isAnimationComplete || time >= start)) {
        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magneticRadius && dist > 0) {
          // Calculate attraction force with falloff
          const normalizedDist = dist / magneticRadius;
          const force = (1 - normalizedDist) ** magneticFalloff * magneticForce;

          // Move towards mouse
          targetX += (dx / dist) * force;
          targetY += (dy / dist) * force;
          activeUpdate = true;
        }
      }

      if (reduceMotion || isAnimationComplete) {
        // Animation done, apply hover scale and magnetic effect
        dummy.position.set(targetX, targetY, 0);
        dummy.rotation.set(0, 0, item.rotation);
        dummy.scale.set(newHoverScale, newHoverScale, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      if (time < start) {
        // Keep at zero scale
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

      // Interpolate with magnetic effect applied to target
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

  // 3. Interactions
  const onMove = React.useCallback(
    (e: any) => {
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
          text: `Age ${item.yearIndex}, Week ${item.weekIndex}${status}`,
        });
        invalidate(); // Trigger re-render for hover effect
      }
    },
    [items, setTooltip, invalidate],
  );

  const onLeave = React.useCallback(() => {
    hoveredIndexRef.current = null;
    setTooltip(null);
    invalidate(); // Trigger re-render for hover effect
  }, [setTooltip, invalidate]);

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

  const InstancedMesh = "instancedMesh" as any;
  const PlaneGeometry = "planeGeometry" as any;
  const Primitive = "primitive" as any;

  return (
    <InstancedMesh
      ref={meshRef}
      args={[undefined, undefined, items.length]}
      onPointerMove={onMove}
      onPointerOut={onLeave}
    >
      <PlaneGeometry args={[boxSize, boxSize]} />
      <Primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </InstancedMesh>
  );
};
