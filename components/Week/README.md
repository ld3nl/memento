# Week Component

A visual representation of a single week in the life table grid.

## Usage

```tsx
import { Week } from "./Week";

// Basic usage - empty week
<Week weekIndex={1} isFilled={false} />

// Filled week (past)
<Week weekIndex={1} isFilled={true} />

// Current week with partial progress
<Week
  weekIndex={10}
  isFilled={false}
  isCurrentWeek={true}
  currentDayOfWeek={3}
/>

// With year label
<Week weekIndex={52} isFilled={true} yearsAlive="25" />
```

## Props

| Prop               | Type      | Required | Description                                     |
| ------------------ | --------- | -------- | ----------------------------------------------- |
| `weekIndex`        | `number`  | Yes      | The week number (1-52)                          |
| `isFilled`         | `boolean` | Yes      | Whether the week has been lived                 |
| `yearsAlive`       | `string`  | No       | Year label to display (shown via CSS `::after`) |
| `isCurrentWeek`    | `boolean` | No       | Whether this is the currently active week       |
| `currentDayOfWeek` | `number`  | No       | Day within current week (1-7) for partial fill  |
| `className`        | `string`  | No       | Additional CSS classes                          |

## Visual States

- **Empty**: Border only, represents future weeks
- **Filled**: Solid background, represents past weeks
- **Current**: Partial fill based on `currentDayOfWeek`, shows progress through the week

## Styling

- Uses Tailwind CSS for styling
- Supports dark mode via `dark:` variants
- Week cells are 8x8px (`size-2`)
- Weeks after index 26 are right-aligned (`ml-auto`)
