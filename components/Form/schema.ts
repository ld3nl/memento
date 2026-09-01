import { z } from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  date: z.string().superRefine((val, ctx) => {
    // First check if the field is empty
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date is required",
      });
      return;
    }

    // Then check if it's a valid date format
    const parsed = Date.parse(val);
    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date format",
      });
      return;
    }

    // Finally check if it's not in the future
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "⏰ Hold up! Time travel isn't invented yet. Your birth date can't be in the future! 🕰️",
      });
      return;
    }
  }),
});
