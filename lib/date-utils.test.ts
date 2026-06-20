import {
  calculateFullAge,
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
  getFormattedAge,
} from './date-utils'

// Mock the current date for consistent testing
const MOCK_TODAY = new Date('2024-06-15T10:00:00Z')

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(MOCK_TODAY)
})

afterAll(() => {
  jest.useRealTimers()
})

describe('date utilities', () => {
  describe('calculateFullAge', () => {
    it('calculates age from string date', () => {
      const result = calculateFullAge('1990-01-15')
      expect(result).toEqual({
        years: 34,
        months: 5,
        days: 0,
      })
    })

    it('calculates age from Date object', () => {
      const birthDate = new Date('1990-01-15')
      const result = calculateFullAge(birthDate)
      expect(result).toEqual({
        years: 34,
        months: 5,
        days: 0,
      })
    })

    it('handles recent birth', () => {
      const result = calculateFullAge('2024-01-01')
      expect(result).toEqual({
        years: 0,
        months: 5,
        days: 14,
      })
    })

    it('returns null for invalid date', () => {
      const result = calculateFullAge('invalid-date')
      expect(result).toBe(null)
    })

    it('handles custom date format', () => {
      const result = calculateFullAge('15/01/1990', 'dd/MM/yyyy')
      expect(result).toEqual({
        years: 34,
        months: 5,
        days: 0,
      })
    })
  })

  describe('getFormattedAge', () => {
    it('formats age correctly', () => {
      const result = getFormattedAge('1990-01-15')
      expect(result).toBe('34 years, 5 months, 0 days')
    })

    it('returns null for invalid date', () => {
      const result = getFormattedAge('invalid-date')
      expect(result).toBe(null)
    })
  })

  describe('calculateYearsAlive', () => {
    it('calculates years alive correctly', () => {
      const result = calculateYearsAlive('1990-01-15')
      expect(result).toBe(33) // Current year minus 1
    })

    it('handles recent birth', () => {
      const result = calculateYearsAlive('2024-01-01')
      expect(result).toBeGreaterThanOrEqual(-1) // Could be -1 or 0 depending on timezone
      expect(result).toBeLessThanOrEqual(0)
    })

    it('returns null for invalid date', () => {
      const result = calculateYearsAlive('invalid-date')
      expect(result).toBe(null)
    })

    it('handles Date object', () => {
      const birthDate = new Date('1990-01-15')
      const result = calculateYearsAlive(birthDate)
      expect(result).toBe(33)
    })
  })

  describe('calculateWeeksFromLastBirthday', () => {
    it('calculates weeks from birthday this year', () => {
      // Birthday was January 15, today is June 15
      const result = calculateWeeksFromLastBirthday('1990-01-15')
      expect(result).toBeGreaterThan(20) // Roughly 22 weeks
      expect(result).toBeLessThan(25)
    })

    it('calculates weeks when birthday hasnt occurred this year', () => {
      // Birthday is December 25, today is June 15
      const result = calculateWeeksFromLastBirthday('1990-12-25')
      expect(result).toBeGreaterThan(20) // From last year's birthday
      expect(result).toBeLessThan(30)
    })

    it("returns 0 for today's birthday", () => {
      const result = calculateWeeksFromLastBirthday('1990-06-15')
      expect(result).toBe(0)
    })

    it('returns null for invalid date', () => {
      const result = calculateWeeksFromLastBirthday('invalid-date')
      expect(result).toBe(null)
    })

    it('handles Date object', () => {
      const birthDate = new Date('1990-01-15')
      const result = calculateWeeksFromLastBirthday(birthDate)
      expect(result).toBeGreaterThan(20)
    })
  })
})
