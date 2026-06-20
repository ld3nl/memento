import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().optional(),
  date: z.string().superRefine((val, ctx) => {
    // First check if the field is empty
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date is required',
      })
      return
    }

    // Then check if it's a valid date format
    const parsed = Date.parse(val)
    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date format',
      })
      return
    }

    // Finally check if it's not in the future
    const date = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "⏰ Hold up! Time travel isn't invented yet. Your birth date can't be in the future! 🕰️",
      })
      return
    }

    // Check if person is significantly over 80 years old
    const ageInMs = today.getTime() - date.getTime()
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25)

    if (ageInYears > 81) {
      // Only show message for people clearly over 80
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "🌟 Wow, you've lived an incredible life! Our life table visualization currently supports up to 80 years. Consider sharing your wisdom with the younger generation! ✨",
      })
    }
  }),
})
