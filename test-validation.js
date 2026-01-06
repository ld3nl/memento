const { z } = require('zod');

const formSchema = z.object({
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
        message: "Date cannot be in the future (yet!)",
      });
    }
  }),
});

// Test empty field
console.log('Testing empty field:');
const result1 = formSchema.safeParse({ name: '', date: '' });
console.log('Errors:', result1.error?.issues.map(issue => issue.message));

// Test invalid format
console.log('\nTesting invalid format:');
const result2 = formSchema.safeParse({ name: '', date: 'invalid-date' });
console.log('Errors:', result2.error?.issues.map(issue => issue.message));

// Test future date
console.log('\nTesting future date:');
const futureDate = new Date();
futureDate.setFullYear(futureDate.getFullYear() + 1);
const result3 = formSchema.safeParse({ name: '', date: futureDate.toISOString().split('T')[0] });
console.log('Errors:', result3.error?.issues.map(issue => issue.message));

// Test valid date
console.log('\nTesting valid date:');
const result4 = formSchema.safeParse({ name: '', date: '1990-01-01' });
console.log('Success:', result4.success);