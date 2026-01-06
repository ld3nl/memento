import type { FieldApi } from "@tanstack/react-form-nextjs";
import { cn } from "../../../lib/utils";

interface LabeledInputProps {
  labelString: string;
  inputId: string;
  inputType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any>;
  placeholder?: string;
}

const LabeledInput = ({
  labelString,
  inputId,
  inputType = "text",
  field,
  placeholder,
}: LabeledInputProps) => {
  return (
    <div className="mb-6 md:flex md:items-center">
      <div className="md:w-1/3">
        <label
          className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
          htmlFor={inputId}
          data-cy={`${inputId}-label`}
        >
          {labelString}
        </label>
      </div>
      <div className="md:w-2/3">
        <input
          className={cn(
            "min-h-16 w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 transition-colors focus:border-purple-500 focus:bg-white focus:outline-none",
            field.state.meta.isTouched && field.state.meta.errors.length > 0
              ? "border-red-500 focus:border-red-500"
              : "",
          )}
          id={inputId}
          type={inputType}
          data-cy={`${inputId}-input`}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
        />
        {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
          <div className="mt-1 text-sm text-red-500">
            {field.state.meta.errors.map((error, index) => (
              <div key={index}>
                {typeof error === 'string'
                  ? error
                  : error?.message ||
                    (error?.issues && error.issues.length > 0 ? error.issues[0].message : String(error))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LabeledInput;
