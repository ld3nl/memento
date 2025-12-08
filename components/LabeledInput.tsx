import type { LabeledInputProps } from "../lib/types";

// LabeledInput component to display a labeled input field
const LabeledInput: React.FC<LabeledInputProps> = ({
  labelString,
  inputId,
  inputType,
  inputProps = {},
}) => (
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
        className="min-h-16 w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
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
