import { LabeledInputProps } from "../lib/types";
import { memo, useId } from "react";

// Suggestions for using React 19 and Next.js 15:
// 1. Use memo to optimize rendering performance
// 2. Implement useId for generating unique IDs
// 3. Consider using Server Components if this component doesn't require client-side interactivity
// 4. Utilize the new 'use client' directive if client-side interactivity is needed
// 5. Implement Suspense boundaries for smoother loading states if fetching data
// 6. Use the new Image component for optimized images if needed in the future
// 7. Leverage improved TypeScript support in Next.js 15
// 8. Implement error boundaries using the new ErrorBoundary component if necessary
// 9. Use the new parallel routing feature for complex UI states if applicable
// 10. Consider using the useFormStatus hook for better form UX if this is part of a form

// LabeledInput component to display a labeled input field
const LabeledInput: React.FC<LabeledInputProps> = ({
  labelString,
  inputId,
  inputType,
  inputProps = {},
}) => (
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-1/3">
      <label
        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
        htmlFor={inputId}
        data-cy={`${inputId}-label`}
      >
        {labelString}
      </label>
    </div>
    <div className="md:w-2/3">
      <input
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        id={inputId}
        type={inputType}
        data-cy={`${inputId}-input`}
        {...inputProps}
      />
    </div>
  </div>
);

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
