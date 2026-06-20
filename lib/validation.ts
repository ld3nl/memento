import { isValid } from 'date-fns'

/**
 * Validation utilities
 */

/**
 * Validates if a date input is valid
 */
export const isValidDate = (
  date: Date | string | number | null | undefined
): boolean => {
  if (!date) return false

  const parsedDate = new Date(date)
  return isValid(parsedDate)
}

/**
 * Validates and parses a date input
 */
export const parseAndValidateDate = (
  date: Date | string | number
): Date | null => {
  if (!date) return null

  const parsedDate = new Date(date)
  return isValid(parsedDate) ? parsedDate : null
}

/**
 * Validates form input data
 */
export const validateFormData = (
  name: string,
  date: string | null
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!date) {
    errors.push('Date of birth is required')
  } else if (!isValidDate(date)) {
    errors.push('Invalid date format')
  }

  if (name && name.trim().length === 0) {
    errors.push('Name cannot be empty if provided')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
