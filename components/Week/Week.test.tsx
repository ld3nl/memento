import { render } from '@testing-library/react'
import { Week } from './Week'

describe('Week', () => {
  it('renders a week cell', () => {
    render(<Week weekIndex={1} isFilled={false} />)
    const weekElement = document.querySelector('.size-2')
    expect(weekElement).toBeInTheDocument()
  })

  it('applies filled styling when isFilled is true', () => {
    const { container } = render(<Week weekIndex={1} isFilled={true} />)
    const weekElement = container.firstChild
    expect(weekElement).toHaveClass('bg-black')
  })

  it('does not apply filled styling when isFilled is false', () => {
    const { container } = render(<Week weekIndex={1} isFilled={false} />)
    const weekElement = container.firstChild
    expect(weekElement).not.toHaveClass('bg-black')
  })

  it('displays year label when yearsAlive is provided', () => {
    render(<Week weekIndex={1} isFilled={false} yearsAlive="25" />)
    const weekElement = document.querySelector('[title="25"]')
    expect(weekElement).toBeInTheDocument()
  })

  it('applies ml-auto class for weeks after week 26', () => {
    const { container } = render(<Week weekIndex={27} isFilled={false} />)
    const weekElement = container.firstChild
    expect(weekElement).toHaveClass('ml-auto')
  })

  it('does not apply ml-auto class for weeks 26 and below', () => {
    const { container } = render(<Week weekIndex={26} isFilled={false} />)
    const weekElement = container.firstChild
    expect(weekElement).not.toHaveClass('ml-auto')
  })

  it('renders current week with partial fill', () => {
    const { container } = render(
      <Week
        weekIndex={1}
        isFilled={false}
        isCurrentWeek={true}
        currentDayOfWeek={3}
      />
    )
    const weekElement = container.firstChild
    expect(weekElement).toHaveClass('current-week')
    expect(weekElement).toHaveAttribute('data-current-week-day', '3')
  })

  it('renders inner fill div with correct percentage for current week', () => {
    const { container } = render(
      <Week
        weekIndex={1}
        isFilled={false}
        isCurrentWeek={true}
        currentDayOfWeek={4}
      />
    )
    const fillDiv = container.querySelector('[aria-hidden="true"]')
    expect(fillDiv).toBeInTheDocument()
    // 4/7 * 100 = ~57%
    expect(fillDiv).toHaveStyle({ width: '57%' })
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <Week weekIndex={1} isFilled={false} className="custom-class" />
    )
    const weekElement = container.firstChild
    expect(weekElement).toHaveClass('custom-class')
  })
})
