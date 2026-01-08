# LifeTable Component

The main component that renders a visual representation of a human lifespan in weeks.

## Usage

```tsx
import { LifeTable } from "./LifeTable";

// With string date
<LifeTable dob="1990-01-15" />

// With Date object
<LifeTable dob={new Date("1990-01-15")} />
```

## Props

| Prop  | Type             | Required | Description   |
| ----- | ---------------- | -------- | ------------- |
| `dob` | `string \| Date` | Yes      | Date of birth |

## How It Works

1. Validates the provided date of birth
2. Calculates years alive and weeks since last birthday
3. Generates decade configuration (weeks per year, years in lifetime)
4. Renders a grid of `DecadeGrid` components representing the full lifespan

## Dependencies

- `DecadeGrid` - Renders individual decade sections
- `lib/date-utils` - Date calculation utilities
- `lib/life-table-utils` - Configuration generation
- `lib/validation` - Input validation

## Error Handling

Returns `null` and logs an error when:

- `dob` is missing or empty
- `dob` is not a valid date
- Age calculations fail

## Data Flow

```
LifeTable
  └── DecadeGrid (x yearsInLifetime)
        └── YearGrid (x decadeLength)
              └── Week (x 52)
```
