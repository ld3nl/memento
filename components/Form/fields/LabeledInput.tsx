import { cn } from "../../../lib/utils";
import { useFieldContext } from "../form-hook";

interface LabeledInputProps {
  labelString: string;
  inputId: string;
  inputType?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const LabeledInput = ({
  labelString,
  inputId,
  inputType = "text",
  placeholder,
  onValueChange,
}: LabeledInputProps) => {
  const field = useFieldContext<string>();
  return (
    <>
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <label
          className="font-display text-xs font-semibold tracking-label text-secondary uppercase transition-colors sm:text-kicker dark:text-secondary"
          htmlFor={inputId}
          data-cy={`${inputId}-label`}
        >
          {labelString}
        </label>
        <input
          className={cn(
            "min-h-[48px] w-full appearance-none rounded-none border-2 bg-surface-raised px-4 py-3.5 font-sans text-base leading-tight text-primary shadow-sm transition-colors duration-200 placeholder:text-secondary focus:ring-4 focus:outline-none sm:min-h-[52px] sm:px-5 sm:text-lg dark:bg-surface-raised dark:text-primary dark:placeholder:text-secondary",
            field.state.meta.isTouched && field.state.meta.errors.length > 0
              ? "border-accent focus:border-accent focus:ring-accent/30"
              : "border-line hover:border-border focus:border-accent focus:ring-accent/20 dark:border-border dark:hover:border-border"
          )}
          id={inputId}
          type={inputType}
          data-cy={`${inputId}-input`}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={e => {
            const value = e.target.value;
            field.handleChange(value);
            onValueChange?.(value);
          }}
          placeholder={placeholder}
          autoComplete={inputType === "date" ? "bday" : "name"}
          aria-invalid={field.state.meta.errors.length > 0}
          aria-describedby={
            field.state.meta.errors.length > 0 ? `${inputId}-error` : undefined
          }
        />
      </div>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <div id={`${inputId}-error`} role="alert" className="mt-2 sm:mt-3">
          <div className="text-sm font-medium text-accent sm:text-base">
            {field.state.meta.errors.map(error => {
              const errorMessage =
                typeof error === "string"
                  ? error
                  : error?.message ||
                    (error?.issues && error.issues.length > 0
                      ? error.issues[0].message
                      : String(error));

              const errorKey =
                typeof error === "string"
                  ? error
                  : error?.issues && error.issues.length > 0
                    ? error.issues
                        .map(
                          issue =>
                            `${issue?.path?.join(".") ?? "field"}:${issue?.message ?? ""}`
                        )
                        .join("|")
                    : errorMessage;

              return <div key={errorKey}>{errorMessage}</div>;
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LabeledInput;
