import { LabeledInputProps } from "../lib/types";
import { memo, useId } from "react";

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
        className="bg-gray-200 appearance-none border-2 min-h-16 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
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
