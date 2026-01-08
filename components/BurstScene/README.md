# BurstScene Component

A 3D radial visualization of life weeks using Three.js and React Three Fiber.

## Usage

```tsx
import { BurstScene } from "./BurstScene";

// Basic usage
<BurstScene dob="1990-01-15" />

// With custom options
<BurstScene
  dob="1990-01-15"
  totalWeeks={4160}
  shape="circle"
  itemSizeRem={0.5}
  itemSpacingRem={0.5}
/>
```

## Props

| Prop             | Type                   | Required | Default    | Description                     |
| ---------------- | ---------------------- | -------- | ---------- | ------------------------------- |
| `dob`            | `string \| Date`       | Yes      | -          | Date of birth                   |
| `totalWeeks`     | `number`               | No       | Calculated | Total weeks to display          |
| `shape`          | `"square" \| "circle"` | No       | `"square"` | Shape of each item              |
| `itemSizeRem`    | `number`               | No       | `0.5`      | Base item size in rem at 1440px |
| `itemSpacingRem` | `number`               | No       | `0.5`      | Base spacing in rem at 1440px   |

## Architecture

```
BurstScene/
├── index.ts              # Public API
├── BurstScene.tsx        # Main component
├── BurstScene.types.ts   # Type definitions
├── SceneContent.tsx      # Three.js scene content
├── config.ts             # Configuration constants
├── hooks/
│   ├── useElementSize.ts        # Container size tracking
│   └── usePrefersReducedMotion.ts # Accessibility
├── utils/
│   ├── layout.ts         # Radial layout computation
│   └── math.ts           # Easing functions
└── shaders/              # Custom GLSL shaders
```

## Features

- Radial burst layout with items arranged in concentric rings
- Responsive sizing based on viewport width
- Respects `prefers-reduced-motion` for accessibility
- Interactive tooltip on hover
- Color gradient based on position
- Staggered animation delays

## Visual States

- **Filled**: Past weeks (solid color)
- **Current**: Week being lived (highlighted)
- **Empty**: Future weeks (outline only)

## Performance

- Uses `frameloop="demand"` for on-demand rendering
- Memoized layout computation
- Optimized pixel ratio (`dpr={[1, 2]}`)
- Container-based sizing via ResizeObserver

## Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `three` - 3D graphics library
- `lib/date-utils` - Date calculations
- `lib/life-table-utils` - Configuration
- `lib/validation` - Input validation
