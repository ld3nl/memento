# YearGrid Component

Renders a grid of 52 weeks representing a single year in the life table.

## Usage

```tsx
import { YearGrid } from "./YearGrid";

<YearGrid
  weeks={Array.from({ length: 52 }, (_, i) => i + 1)}
  yearsAlive={25}
  currentDecadeYear={26}
  weeksFromLastBday={10}
  daysIntoCurrentWeek={3}
/>;
```

## Props

| Prop                  | Type                | Required | Description                       |
| --------------------- | ------------------- | -------- | --------------------------------- |
| `weeks`               | `readonly number[]` | Yes      | Array of week indices (1-52)      |
| `yearsAlive`          | `number`            | Yes      | Total years the person has lived  |
| `currentDecadeYear`   | `number`            | Yes      | The year this grid represents     |
| `weeksFromLastBday`   | `number`            | Yes      | Weeks elapsed since last birthday |
| `daysIntoCurrentWeek` | `number`            | Yes      | Days into the current week (1-7)  |

## Visual Logic

The component determines each week's state:

- **Filled**: Week is in the past (already lived)
- **Current**: Week is being actively lived (shows partial progress)
- **Empty**: Week is in the future

### Year Labels

Year labels are shown on the last week (week 52) for:

- Year 1
- Every 5th year (5, 10, 15, 20, etc.)

## Internal Utilities

Located in `./utils.ts`:

- `shouldWeekBeFilled()` - Determines if a week should be filled
- `isCurrentWeek()` - Identifies the currently active week
- `shouldShowYearLabel()` - Determines if year label should display

## Grid Layout

- 52 columns (one per week)
- Fixed width of 208px (`w-208`)
- Uses CSS Grid for layout
