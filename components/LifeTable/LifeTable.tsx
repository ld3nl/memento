'use client'

import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
  getDaysIntoCurrentWeek,
} from '../../lib/date-utils'
import { generateDecadeConfig } from '../../lib/life-table-utils'
import { isValidDate } from '../../lib/validation'
import DecadeGrid from '../DecadeGrid'
import type { LifeTableProps } from './LifeTable.types'

export const LifeTable = ({ dob }: LifeTableProps) => {
  // Validate input DOB
  if (!dob) {
    console.error('Missing date of birth')
    return null
  }

  if (!isValidDate(dob)) {
    console.error('Invalid date of birth:', dob)
    return null
  }

  // Calculate years alive and weeks from birthday using utilities
  const yearsAlive = calculateYearsAlive(dob)
  const weeksFromBirthday = calculateWeeksFromLastBirthday(dob)
  const daysIntoCurrentWeek = getDaysIntoCurrentWeek(dob)

  // Return null if calculations failed
  if (
    yearsAlive === null ||
    weeksFromBirthday === null ||
    daysIntoCurrentWeek === null
  ) {
    console.error('Failed to calculate age data')
    return null
  }

  // Get configuration using utilities
  const { weeks, yearsInLifetime, decadeLength } = generateDecadeConfig()

  return (
    <div className="flex flex-col gap-4" data-cy="life-table">
      {Array.from({ length: yearsInLifetime }, (_, yearIndex) => (
        <DecadeGrid
          key={yearIndex}
          decadeLength={decadeLength}
          weeks={weeks}
          yearsAlive={yearsAlive}
          yearIndex={yearIndex}
          weeksFromLastBday={weeksFromBirthday}
          daysIntoCurrentWeek={daysIntoCurrentWeek}
        />
      ))}
    </div>
  )
}
