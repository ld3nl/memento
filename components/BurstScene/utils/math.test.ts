import { easeOutCubic } from './math'

describe('BurstScene math utilities', () => {
  describe('easeOutCubic', () => {
    it('returns 0 when t is 0', () => {
      expect(easeOutCubic(0)).toBe(0)
    })

    it('returns 1 when t is 1', () => {
      expect(easeOutCubic(1)).toBe(1)
    })

    it('returns value between 0 and 1 for t between 0 and 1', () => {
      const result = easeOutCubic(0.5)
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(1)
    })

    it('eases out (faster at start, slower at end)', () => {
      // At t=0.5, easeOutCubic should be > 0.5 (faster progress early)
      const midpoint = easeOutCubic(0.5)
      expect(midpoint).toBeGreaterThan(0.5)
    })

    it('is monotonically increasing', () => {
      let prev = 0
      for (let t = 0; t <= 1; t += 0.1) {
        const current = easeOutCubic(t)
        expect(current).toBeGreaterThanOrEqual(prev)
        prev = current
      }
    })
  })
})
