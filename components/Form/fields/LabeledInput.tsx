import { createFormHookContexts } from '@tanstack/react-form-nextjs'
import { cn } from '../../../lib/utils'

// Import the field context (same one used in Form.tsx)
const { useFieldContext } = createFormHookContexts()

interface LabeledInputProps {
  labelString: string
  inputId: string
  inputType?: string
  placeholder?: string
  onValueChange?: (value: string) => void
}

const LabeledInput = ({
  labelString,
  inputId,
  inputType = 'text',
  placeholder,
  onValueChange,
}: LabeledInputProps) => {
  const field = useFieldContext<string>()
  return (
    <>
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <label
          className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 transition-colors sm:text-[0.6875rem]"
          htmlFor={inputId}
          data-cy={`${inputId}-label`}
        >
          {labelString}
        </label>
        <input
          className={cn(
            'min-h-[48px] w-full appearance-none rounded-none border-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-3.5 font-body text-base leading-tight text-zinc-900 dark:text-zinc-50 shadow-sm transition-all duration-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-4 sm:min-h-[52px] sm:px-5 sm:text-lg',
            field.state.meta.isTouched && field.state.meta.errors.length > 0
              ? 'border-red-600 focus:border-red-600 focus:ring-red-600/30'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-red-600 focus:ring-red-600/20'
          )}
          id={inputId}
          type={inputType}
          data-cy={`${inputId}-input`}
          name={field.name}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const value = e.target.value
            field.handleChange(value)
            onValueChange?.(value)
          }}
          placeholder={placeholder}
          aria-invalid={field.state.meta.errors.length > 0}
          aria-describedby={
            field.state.meta.errors.length > 0 ? `${inputId}-error` : undefined
          }
        />
      </div>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <div
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 animate-in fade-in slide-in-from-top-1 duration-300 sm:mt-3"
        >
          <div className="text-sm font-medium text-red-600 sm:text-base">
            {field.state.meta.errors.map((error) => {
              const errorMessage =
                typeof error === 'string'
                  ? error
                  : error?.message ||
                    (error?.issues && error.issues.length > 0
                      ? error.issues[0].message
                      : String(error))

              const errorKey =
                typeof error === 'string'
                  ? error
                  : error?.issues && error.issues.length > 0
                    ? error.issues
                        .map(
                          (issue) =>
                            `${issue?.path?.join('.') ?? 'field'}:${issue?.message ?? ''}`
                        )
                        .join('|')
                    : errorMessage

              return <div key={errorKey}>{errorMessage}</div>
            })}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default LabeledInput
