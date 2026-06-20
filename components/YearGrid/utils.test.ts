import { WEEKS_PER_YEAR } from '../../lib/constants'
import { isCurrentWeek, shouldShowYearLabel, shouldWeekBeFilled } from './utils'

describe('YearGrid utilities', () => {
  describe('shouldWeekBeFilled', () => {
    it('fills weeks for completed years', () => {
      // Person is 25 years old, checking year 20
      expect(shouldWeekBeFilled(25, 20, 1, 0)).toBe(true)
      expect(shouldWeekBeFilled(25, 20, 52, 0)).toBe(true)
    })

    it('does not fill weeks for future years', () => {
      // Person is 25 years old, checking year 30
      expect(shouldWeekBeFilled(25, 30, 1, 0)).toBe(false)
      expect(shouldWeekBeFilled(25, 30, 52, 0)).toBe(false)
    })

    it('partially fills current year based on weeks from birthday', () => {
      // Person is 25 years old, currently in year 26, 10 weeks from birthday
      expect(shouldWeekBeFilled(25, 26, 5, 10)).toBe(true) // Week 5 should be filled
      expect(shouldWeekBeFilled(25, 26, 10, 10)).toBe(true) // Week 10 should be filled
      expect(shouldWeekBeFilled(25, 26, 15, 10)).toBe(false) // Week 15 should not be filled
    })

    it('handles edge case of exact birthday', () => {
      expect(shouldWeekBeFilled(25, 26, 1, 1)).toBe(true)
      expect(shouldWeekBeFilled(25, 26, 1, 0)).toBe(false)
    })
  })

  describe('shouldShowYearLabel', () => {
    it('shows label for year 1', () => {
      expect(shouldShowYearLabel(1, WEEKS_PER_YEAR)).toBe(true)
    })

    it('shows label for multiples of 5 at end of year', () => {
      expect(shouldShowYearLabel(5, WEEKS_PER_YEAR)).toBe(true)
      expect(shouldShowYearLabel(10, WEEKS_PER_YEAR)).toBe(true)
      expect(shouldShowYearLabel(15, WEEKS_PER_YEAR)).toBe(true)
    })

    it('does not show label for non-multiples of 5', () => {
      expect(shouldShowYearLabel(2, WEEKS_PER_YEAR)).toBe(false)
      expect(shouldShowYearLabel(3, WEEKS_PER_YEAR)).toBe(false)
      expect(shouldShowYearLabel(7, WEEKS_PER_YEAR)).toBe(false)
    })

    it('does not show label when not at end of year', () => {
      expect(shouldShowYearLabel(5, 1)).toBe(false)
      expect(shouldShowYearLabel(10, 25)).toBe(false)
      expect(shouldShowYearLabel(1, 30)).toBe(false)
    })
  })

  describe('isCurrentWeek', () => {
    it('identifies current week correctly', () => {
      // Person is 25 years old, 10 weeks since birthday
      // Week 11 should be the current week
      expect(isCurrentWeek(25, 26, 11, 10)).toBe(true)
    })

    it('does not mark completed weeks as current', () => {
      // Person is 25 years old, 10 weeks since birthday
      // Week 5 is already completed
      expect(isCurrentWeek(25, 26, 5, 10)).toBe(false)
    })

    it('does not mark future weeks as current', () => {
      // Person is 25 years old, 10 weeks since birthday
      // Week 15 is in the future
      expect(isCurrentWeek(25, 26, 15, 10)).toBe(false)
    })

    it('does not mark weeks in completed years as current', () => {
      // Person is 25 years old, checking year 20
      expect(isCurrentWeek(25, 20, 11, 10)).toBe(false)
    })

    it('does not mark weeks in future years as current', () => {
      // Person is 25 years old, checking year 30
      expect(isCurrentWeek(25, 30, 11, 10)).toBe(false)
    })

    it('identifies week 1 as current when 0 weeks have passed', () => {
      // Just had birthday (0 weeks)
      expect(isCurrentWeek(25, 26, 1, 0)).toBe(true)
    })
  })
})
