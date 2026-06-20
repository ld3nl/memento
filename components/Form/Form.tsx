'use client'
'use no memo'

import {
  createFormHook,
  createFormHookContexts,
} from '@tanstack/react-form-nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getFormattedAge } from '../../lib/date-utils'
import { FormStorage } from '../../lib/storage'
import { generateLifeTableUrl } from '../../lib/url-utils'
import { cn } from '../../lib/utils'
import LabeledInput from './fields/LabeledInput'
import { formSchema } from './schema'

// Create form contexts and hooks
const { fieldContext, formContext, useFormContext } = createFormHookContexts()

// Create SubmitButton component using useFormContext
function SubmitButton() {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          className={cn(
            'w-full min-h-[52px] rounded-none border-[3px] border-red-600 bg-white dark:bg-zinc-900 cursor-pointer px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-red-600 shadow-lg shadow-red-600/10 transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-xl hover:shadow-red-600/20 focus:outline-none focus:ring-4 focus:ring-red-600/40 active:scale-[0.98] sm:w-auto sm:min-w-[240px] sm:text-base sm:px-8',
            {
              'cursor-not-allowed opacity-40 hover:bg-white dark:hover:bg-zinc-900 hover:text-red-600 hover:shadow-lg':
                !canSubmit,
            }
          )}
          type="submit"
          disabled={!canSubmit}
          data-cy={'generate-table-button'}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Summoning...' : 'Reveal Calendar'}
        </button>
      )}
    </form.Subscribe>
  )
}

// Create the app form hook with pre-configured components
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    LabeledInput,
  },
  formComponents: {
    SubmitButton,
  },
})

const Form = () => {
  const router = useRouter()
  const [saveData, setSaveData] = useState(false)
  const [weeksLived, setWeeksLived] = useState<number | null>(null)

  const form = useAppForm({
    defaultValues: {
      name: '',
      date: '',
    } as { name?: string; date: string },

    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Save form data if save checkbox is checked
      if (saveData) {
        await FormStorage.saveFormData({
          name: value.name,
          date: value.date,
          saveData: true,
        })
      } else {
        // Clear saved data if save is unchecked
        await FormStorage.clearFormData()
      }

      // Navigate to the life table page
      const url = generateLifeTableUrl(value.date, value.name)
      router.push(url)
    },
  })

  const saveValues = async (values: { name?: string; date: string }) => {
    if (!saveData || (!values.date && !values.name)) return

    try {
      await FormStorage.saveFormData({
        name: values.name,
        date: values.date,
        saveData: true,
      })
    } catch (error) {
      console.error('Failed to save form data:', error)
    }
  }

  // Calculate weeks lived - memoized to avoid recreation
  const calculateWeeksLived = React.useCallback((birthdate: string) => {
    if (!birthdate) return null
    const birth = new Date(birthdate)
    const now = new Date()
    const msPerWeek = 1000 * 60 * 60 * 24 * 7
    return Math.floor((now.getTime() - birth.getTime()) / msPerWeek)
  }, [])

  // Load saved form data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await FormStorage.loadFormData().catch((error) => {
        console.error('Failed to load saved form data:', error)
        return null
      })

      if (savedData) {
        form.setFieldValue('name', savedData.name || '')
        form.setFieldValue('date', savedData.date || '')
        setSaveData(() => savedData.saveData || false)

        if (savedData.date) {
          setWeeksLived(calculateWeeksLived(savedData.date))
        }
      }
    }

    loadSavedData()
  }, [form, calculateWeeksLived])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Left column - Image and intro */}
        <div className="flex flex-col justify-center space-y-5 sm:space-y-6 lg:space-y-8">
          <div className="relative">
            <Image
              src="https://utfs.io/f/vfxFGWyJBql9xCI1QO2QPvwdGrZoHIKXJqsfUxy6C9SDnN7b"
              alt="Memento Mori Skull"
              width={177}
              height={141}
              className="mb-4 w-32 opacity-90 grayscale contrast-125 sm:mb-5 sm:w-36 lg:w-44"
              loading="eager"
              priority
            />
            <h1 className="font-display text-[2.5rem] italic leading-[0.95] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl xl:text-7xl">
              Memento
              <br />
              Mori
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:mt-6 sm:text-lg">
              Every week is numbered. Enter your birthdate to see yours.
            </p>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="flex flex-col justify-center">
          <form
            data-cy={'bday-form'}
            action={() => form.handleSubmit()}
            className="space-y-6 sm:space-y-7"
            noValidate
          >
            <form.AppField name="name">
              {(field) => (
                <field.LabeledInput
                  labelString="Name"
                  inputId="inline-name"
                  placeholder="Enter your name (optional)"
                  onValueChange={(name) =>
                    void saveValues({ ...form.state.values, name })
                  }
                />
              )}
            </form.AppField>

            <form.AppField name="date">
              {(field) => (
                <>
                  <field.LabeledInput
                    labelString="Birthdate"
                    inputId="birthday"
                    inputType="date"
                    onValueChange={(date) => {
                      void saveValues({ ...form.state.values, date })
                      setWeeksLived(calculateWeeksLived(date))
                    }}
                  />
                  {field.state.value &&
                    !field.state.meta.errors.length &&
                    weeksLived !== null && (
                      <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 sm:mt-8">
                        <div className="border-[3px] border-red-600 bg-white dark:bg-zinc-900 p-6 shadow-2xl shadow-red-600/10 sm:p-7 lg:p-8">
                          <div className="font-mono text-5xl font-bold tabular-nums tracking-tight text-red-600 sm:text-6xl lg:text-7xl">
                            {weeksLived.toLocaleString()}
                          </div>
                          <div className="mt-3 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 sm:mt-4">
                            Weeks lived
                          </div>
                          {field.state.value && (
                            <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 font-display text-sm italic leading-relaxed text-zinc-500 dark:text-zinc-400">
                              {getFormattedAge(field.state.value)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </>
              )}
            </form.AppField>

            <div className="flex items-start space-x-3 py-2">
              <input
                id="save-data-checkbox"
                className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-none border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-red-600 transition-all checked:border-red-600 checked:bg-red-600 hover:border-zinc-400 dark:hover:border-zinc-600 focus:outline-none focus:ring-4 focus:ring-red-600/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950"
                type="checkbox"
                checked={saveData}
                onChange={async (e) => {
                  const isChecked = e.target.checked
                  setSaveData(isChecked)

                  if (isChecked) {
                    const values = form.state.values
                    try {
                      await FormStorage.saveFormData({
                        name: values.name,
                        date: values.date,
                        saveData: true,
                      })
                    } catch (error) {
                      console.error('Failed to save form data:', error)
                    }
                  } else {
                    try {
                      await FormStorage.clearFormData()
                    } catch (error) {
                      console.error('Failed to clear form data:', error)
                    }
                  }
                }}
                data-cy={'input-checkbox-save'}
                aria-describedby="save-data-description"
              />
              <label
                htmlFor="save-data-checkbox"
                className="cursor-pointer select-none text-sm leading-snug text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 sm:text-base"
              >
                <span id="save-data-description">Remember my information</span>
              </label>
            </div>

            <form.AppForm>
              <form.SubmitButton />
            </form.AppForm>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Form
