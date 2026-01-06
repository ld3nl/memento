The `components/Form/*` directory refactors the existing "Memento Mori" input form into a robust, type-safe component using TanStack Form and Zod. It ensures reliable validation for dates and names, better accessibility, and a cleaner separation of concerns.

## 1. High-Level Architecture

- **State Management**: Uses `@tanstack/react-form-nextjs` for form state (values, touched, dirty, errors).
- **Validation**: Uses **Zod** schema validation (replacing manual `lib/validation.ts` checks).
- **UI Layer**: Styled with Tailwind CSS, maintaining the existing dark/light mode support.
- **Action**: Instead of a simple HTML form action, it validates input via TanStack Form before navigating to the resulting Life Table URL.

## 2. File Structure & Responsibilities

| File                      | Purpose                                                 | Key Libraries                        |
| :------------------------ | :------------------------------------------------------ | :----------------------------------- |
| `index.tsx`               | The public export of the form component.                | React                                |
| `Form.tsx`                | The core UI, containing fields and the submit handler.  | `@tanstack/react-form-nextjs`, `zod` |
| `schema.ts`               | Zod schema definition for the form (Name & Date).       | `zod`                                |
| `fields/`                 | Directory for reusable field components.                |                                      |
| `fields/LabeledInput.tsx` | (Refactored) Wrapper for label + input + error display. |                                      |

## 3. Detailed Component Breakdown

### A. The Form Component (`Form.tsx`)

This replaces the existing `components/Form.tsx`.

- **Setup**: Initializes `useForm` from `@tanstack/react-form-nextjs`.
- **Validation**:
  - `validators.onChange`: Uses the Zod schema from `schema.ts`.
  - Real-time feedback for invalid dates (e.g., future dates).
- **Submission**:
  - `onSubmit`: Takes the valid data (`name`, `date`), generates the target URL using `lib/url-utils`, and performs a client-side navigation (using Next.js `router.push` or native behavior).

### B. Validation Schema (`schema.ts`)

Defines the structure of the form data using Zod.

```typescript
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date cannot be in the future (yet!)",
    }),
});
```

### C. Reusable Fields (`fields/LabeledInput.tsx`)

Adapts the existing `LabeledInput` to integration with TanStack Form's `Field` component.

- Accepts `field` object from TanStack Form to handle `value`, `onChange`, `onBlur`.
- Displays error messages automatically from the field state.

## 4. Data Flow

1.  **User Input**: User enters Name and Birthday.
2.  **Validation**: TanStack Form runs the Zod validator.
    - If invalid (e.g., missing date), the "Generate Table" button remains disabled or shows errors on blur.
3.  **Submission**:
    - User clicks "Generate Table".
    - Form submits.
    - `onSubmit` handler formats the URL: `/table/[yyyy]/[mm]/[dd]?name=...`
    - App navigates to the visualization page.

## 5. Benefits of Refactor

- **Type Safety**: Full end-to-end typing of form values.
- **Maintainability**: Validation logic is centralized in Zod schemas, not scattered in helper functions.
- **UX**: Better handling of touched/dirty states for error messages (only show errors after user interaction).
- **Scalability**: Easier to add more fields later (e.g., "Life Expectancy" override options).
