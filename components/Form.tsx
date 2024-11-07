"use client";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { parse, intervalToDuration } from "date-fns";
import LabeledInput from "./LabeledInput";

// Suggestions for using React 19 and Next.js 15:
// 1. Use the new useFormState hook for form state management
// 2. Implement Server Actions for form submissions
// 3. Utilize the useOptimistic hook for optimistic UI updates
// 4. Use the new useFormStatus hook for better form UX
// 5. Implement Suspense boundaries for improved loading states
// 6. Take advantage of the new streaming SSR capabilities
// 7. Use the improved Image component for better image optimization
// 8. Leverage the new app directory structure for better organization
// 9. Implement parallel routing for more complex UI states
// 10. Use the new error.js file for custom error handling

const Form = () => {
  // const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);

  const calculateFullAge = (dob) => {
    const birthDate = parse(dob, "yyyy-MM-dd", new Date());
    const { years, months, days } = intervalToDuration({
      start: birthDate,
      end: new Date(),
    });
    return { years, months, days };
  };

  const yeasAlive = (dob) => {
    (!dob || dob === "") && "Enter valid date";

    const { years, months, days } = calculateFullAge(dob);

    return `${years} years, ${months} months, ${days} days`;
  };

  const generateUrl = (date, name) => {
    return `/table${date ? `/${date.split("-").join("/")}` : ""}${
      name ? `?name=${encodeURIComponent(name)}` : ""
    }`;
  };
  // const handleClick = (e) => {
  //   e.preventDefault();

  //   // Construct the URL string manually to avoid type errors
  //   const url = `/table${date ? `/${date.split("-").join("/")}` : ""}${
  //     name ? `?name=${encodeURIComponent(name)}` : ""
  //   }`;

  // router.push(url);
  // };

  return (
    <form
      className="w-full max-w-md"
      data-cy={"bday-form"}
      action={`${generateUrl(date, name)}`}
    >
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3"></div>

        <h1 className="md:w-2/3 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4">
          Memento mori form {name && `for ${name}`}
        </h1>
      </div>

      <LabeledInput
        labelString={"Name"}
        inputId={"inline-name"}
        inputType={"text"}
        inputProps={{
          onChange: ({ target }) => {
            setName(target.value);
          },
        }}
      />

      <LabeledInput
        labelString={"Birthday"}
        inputId={"birthday"}
        inputType={"date"}
        inputProps={{
          required: true,
          onChange: ({ target }) => {
            setDate(target.value);
          },
        }}
      />
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <span
            className={`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 transition-all ${
              !date && "opacity-0"
            }`}
          >
            Are you:
          </span>
        </div>

        <div className="md:w-2/3 dark:text-white" data-cy={`age`}>
          {date && `${yeasAlive(date)} young?`}
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3"></div>
        <label className="md:w-2/3 block text-gray-500 font-bold">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            data-cy={`input-checkbox-save`}
          />
          <span className="text-sm">Save</span>
        </label>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button
            className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
              !date &&
              "cursor-not-allowed focus:outline-none disabled:opacity-75"
            }`}
            type="submit"
            disabled={!date}
            data-cy={`generate-table-button`}
          >
            Generate Table
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;

// Additional detailed suggestions for using React 19 and Next.js 15:
// 1. Implement Server Actions:
//    - Create a server action for form submission in a separate file (e.g., actions.js)
//    - Use the 'use server' directive at the top of the file
//    - Replace the handleClick function with a server action
//
// 2. Use the useFormState hook:
//    - Import useFormState from 'react-dom'
//    - Replace useState for form state management
//    - This will provide better integration with server actions
//
// 3. Implement the useFormStatus hook:
//    - Import useFormStatus from 'react-dom'
//    - Use it to show loading states during form submission
//
// 4. Utilize Suspense boundaries:
//    - Wrap dynamic content in Suspense components
//    - Provide fallback UI for loading states
//
// 5. Implement parallel routing:
//    - Create a more complex UI with multiple simultaneous pages
//    - Use the new folder structure (@folder) for parallel routes
//
// 6. Leverage the new app directory structure:
//    - Move this component to app/components/Form.tsx
//    - Create a separate route handler in app/api/form/route.ts
//
// 7. Implement error handling:
//    - Create an error.js file in the same directory as your page
//    - Provide custom error UI and logic
//
// 8. Use the new Image component:
//    - If you need to display images, use the optimized Next.js Image component
//    - Import from 'next/image'
//
// 9. Implement streaming SSR:
//    - Use React.lazy() for component-level code splitting
//    - Implement <Suspense> boundaries around lazy-loaded components
//
// 10. Optimize with React Server Components:
//     - Convert non-interactive parts of your form to Server Components
//     - This can improve performance and reduce client-side JavaScript
