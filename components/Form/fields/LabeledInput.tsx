import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { kicker } from "../../../styles/recipes/kicker.stylex";
import { tokens } from "../../../styles/tokens.stylex";
import { useFieldContext } from "../form-hook";

interface LabeledInputProps {
  labelString: string;
  inputId: string;
  inputType?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const styles = stylex.create({
  field: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: {
      default: "0.5rem",
      [breakpoints.sm]: "0.75rem",
    },
  },
  label: {
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: tokens.kicker,
    },
    lineHeight: "calc(1 / 0.75)",
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  input: {
    minHeight: {
      default: "3rem",
      [breakpoints.sm]: "3.25rem",
    },
    width: "100%",
    appearance: "none",
    borderRadius: 0,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":hover": tokens.border,
      ":focus": tokens.accent,
    },
    backgroundColor: tokens.surfaceRaised,
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.25rem",
    },
    paddingBlock: "0.875rem",
    /* Match Tailwind font-sans exactly (no extra generic fallback). */
    fontFamily: "var(--font-inter)",
    fontSize: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    lineHeight: 1.25,
    color: tokens.primary,
    boxShadow: {
      default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      ":focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    "::placeholder": {
      color: tokens.secondary,
    },
  },
  inputError: {
    borderColor: {
      default: tokens.accent,
      ":hover": tokens.accent,
      ":focus": tokens.accent,
    },
    boxShadow: {
      default: null,
      ":focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 30%, transparent), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
    },
  },
  errorText: {
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: {
      default: "calc(1.25 / 0.875)",
      [breakpoints.sm]: 1.5,
    },
    fontWeight: 500,
    color: tokens.accent,
  },
});

const LabeledInput = ({
  labelString,
  inputId,
  inputType = "text",
  placeholder,
  onValueChange,
}: LabeledInputProps) => {
  const field = useFieldContext<string>();
  const invalid = field.state.meta.errors.length > 0;
  const hasError = field.state.meta.isTouched && invalid;

  return (
    <>
      <div {...stylex.props(styles.field)}>
        <label
          {...stylex.props(kicker.base, styles.label)}
          htmlFor={inputId}
          data-cy={`${inputId}-label`}
        >
          {labelString}
        </label>
        <input
          {...stylex.props(styles.input, hasError && styles.inputError)}
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
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
        />
      </div>
      {hasError ? (
        <div id={`${inputId}-error`} role="alert">
          <div {...stylex.props(styles.errorText)}>
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
